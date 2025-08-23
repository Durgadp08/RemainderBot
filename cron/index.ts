import { CronJob } from "cron";
import { getMessagesByTaskId, getTasksAtDueTime } from "../src/dbQueries";
import { sendMessage } from "../src/messages";
import { logger } from "../src/logger";

const job = new CronJob(
  "* * * * *",
  function () {
    try {
      const tasks = getTasksAtDueTime();
      tasks.forEach((task) => {
        const { id, ownerid } = task;
        const messages = getMessagesByTaskId(id);
        if (messages) {
          const random = Math.floor(Math.random() * 3);
          logger.info("Preparing messages to send");
          sendMessage(ownerid, messages[random].message);
        }
      });
    } catch (error) {
      logger.error("Error while running cron job ", error);
    }
  },
  null
);

job.start();
