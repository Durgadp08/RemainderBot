import "dotenv/config";
import bot from ".";
import {
  getUserByremoteID,
  insertManyTasksWithMessagesByOwnerID,
  insertUserByRemoteID,
} from "./dbQueries";
import { logger } from "./logger";

import generateContent, { TaskResponse } from "./ai";
import { english } from "./language";

export const handleReceivedmessage = async (
  remoteID: string,
  message: string
) => {
  try {
    logger.info("Message to be handled");
    const user = getUserByremoteID(remoteID);
    const toSend = await getMessageToSend(user, message, remoteID);
    sendMessage(remoteID, toSend);
  } catch (err) {
    logger.error("Handle message recevied error ", err);
  }
};

// Sends the message to the remote user id
export const sendMessage = (remoteID: string, message: string) => {
  logger.info(
    `Message is sending to user with remoteID ${remoteID} and message as ${message}`
  );
  bot
    .then((sock) => {
      sock.sendMessage(remoteID, {
        text: message,
      });
    })
    .catch((err) => {
      logger.error(
        `Message send failed to user with id ${remoteID} and message ${message} `,
        err
      );
    });
};

// gets the message to be send to the user
export const getMessageToSend = async (
  user: boolean,
  message: string,
  remoteID: string
): Promise<string> => {
  if (!user) {
    if (
      message.toLocaleLowerCase() === "hi" ||
      message.toLocaleLowerCase() === "hii"
    ) {
      const addUser = insertUserByRemoteID(remoteID);
      if (addUser == 1) {
        return english.greeting;
      }
      return english.issuemessage;
    } else {
      return english.retrymessage;
    }
  }

  const response: TaskResponse = await generateContent(message);
  if (!response.success) {
    return response.message;
  }
  console.log(response);

  const result = insertManyTasksWithMessagesByOwnerID(response.tasks, remoteID);
  if (!result.success && result.error) {
    return result.error;
  }
  return english.successmessage;
};
