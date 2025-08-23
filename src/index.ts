import {
  makeWASocket,
  useMultiFileAuthState,
  fetchLatestBaileysVersion,
  DisconnectReason,
  makeCacheableSignalKeyStore,
} from "@whiskeysockets/baileys";
import qrcode from "qrcode";
import P from "pino";
import "dotenv/config";
import { Boom } from "@hapi/boom";
import { handleReceivedmessage } from "./messages";
import { logger } from "./logger";

const whatsAppLogger = P(
  {
    timestamp: () => `,"time":"${new Date().toJSON()}"`,
    level: process.env.PINO_LOG_LEVEL || "info",
  },
  P.destination("./logs/wa-logs.txt")
);

const phoneNumber = process.env.PHONE_NUMBER || "";

const usePairingCode = false;

const BotWA = async () => {
  const { state, saveCreds } = await useMultiFileAuthState("auth_info");
  const { version } = await fetchLatestBaileysVersion();

  const sock = makeWASocket({
    logger: whatsAppLogger,
    version,
    auth: {
      creds: state.creds,
      keys: makeCacheableSignalKeyStore(state.keys, whatsAppLogger),
    },
  });

  if (usePairingCode && !sock.authState.creds.registered) {
    let code;
    if (phoneNumber) code = await sock.requestPairingCode(phoneNumber);
    else logger.error("Phone number is not defined in env file");

    logger.info(`Here is the code for login : ${code}`);
  }
  sock.ev.on("creds.update", saveCreds);

  sock.ev.on("connection.update", async (update) => {
    const { connection, lastDisconnect, qr } = update;
    console.log(connection);

    if (qr) {
      qrcode.toFile("qr.png", qr, { width: 200, margin: 1 }, (err) => {
        if (err) logger.error(err);
        logger.info("QRcode is saved as PNG file");
      });
    }

    if (connection === "close") {
      const shouldReconnect =
        !lastDisconnect?.error ||
        (lastDisconnect.error as Boom)?.output?.statusCode !==
          DisconnectReason.loggedOut;

      if (shouldReconnect) {
        logger.info("Reconnecting...");
        BotWA();
      } else {
        logger.info("Logged out from WhatsApp");
      }
    }
    if (connection === "open") {
      logger.info("Connected to WhatsApp");
    }
  });

  sock.ev.on("messages.upsert", ({ messages, type }) => {
    if (type != "notify") return;
    for (const msg of messages) {
      logger.info(`Received a message from ${msg.pushName}`);
      let message, remoteID;
      if (
        (message =
          msg.message?.conversation ||
          msg.message?.extendedTextMessage?.text) &&
        (remoteID = msg.key.remoteJid)
      ) {
        const name = msg.pushName;
        console.log(name);
        logger.info(
          `Message is handling by file message.ts for user ${msg.pushName} with message ${message}`
        );
        handleReceivedmessage(remoteID, message);
      }
    }
  });
  return sock;
};

const bot = BotWA();

export default bot;
