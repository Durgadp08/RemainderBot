import { Task } from "./ai";
import db from "./Database/db";
import { english } from "./language";
import { logger } from "./logger";

export const getUserByremoteID = (remoteID: string) => {
  logger.info("Request to get User by id ", remoteID);
  try {
    const userResult = db
      .prepare("select * from users where remoteid = ?")
      .get(remoteID);

    if (userResult) {
      return true;
    }
    return false;
  } catch (error) {
    logger.error("Database Query to get user by id failed : ", error);
    return false;
  }
};

export const insertUserByRemoteID = (remoteid: string) => {
  logger.info("Request to insert User by remoteid : ", remoteid);
  try {
    const insert = db
      .prepare("insert into users (remoteid) values (?)")
      .run(remoteid);
    return insert.changes;
  } catch (error) {
    logger.error("Database Query to insert user by id failed : ", error);
    return 0;
  }
};

export const deleteUserByID = (id: string) => {};

export const insertManyTasksWithMessagesByOwnerID = (
  tasks: Task[],
  ownerid: string
): { success: boolean; error?: string } => {
  try {
    const insertTask = db.prepare(
      "insert into tasks (task,recurrence,ownerid,due,status) values(?,?,?,?,?)"
    );
    const insertMessage = db.prepare(
      "insert into messages (task_id,message) values (?,?)"
    );

    const insertManyTasks = db.transaction((tasks: Task[]) => {
      for (const { task, recurrence, due, status, messages } of tasks) {
        const taskResult = insertTask.run(
          task,
          recurrence,
          ownerid,
          due,
          status
        );

        if (taskResult.changes !== 1) {
          logger.error("Database Query to insert task failed");
          throw new Error(`Insert task failed with ownerid ${ownerid}`);
        }

        const taskId = taskResult.lastInsertRowid;
        logger.info(`Inserted task with id ${taskId}`);

        for (const message of messages) {
          const messageResult = insertMessage.run(taskId, message);
          if (messageResult.changes !== 1) {
            logger.error("Database Query to insert message failed");
            throw new Error(
              `Insert message failed for task_id ${taskId} (ownerid: ${ownerid})`
            );
          }
          logger.info(`Inserted message for task_id ${taskId}`);
        }
      }
    });

    insertManyTasks(tasks);
    return { success: true };
  } catch (error) {
    logger.error("Database Query to insert tasks failed ", error);
    return { success: false, error: english.errormessage };
  }
};

export const getMessagesByTaskId = (id: number) => {
  try {
    const messageResult = db
      .prepare("select message from messages where task_id = ? ")
      .all(id);

    return messageResult;
  } catch (error) {
    logger.error("Database Query to get tasks by id ", error);
  }
};

export const getTasksById = (id: number) => {};

