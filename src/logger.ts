import P from "pino";

export const logger = P(
  {
    timestamp: () => `,"time":"${new Date().toJSON()}"`,
    level: process.env.PINO_LOG_LEVEL || "info",
  },
  P.destination({
    dest: "./logs/my-logs.txt",
  })
);
