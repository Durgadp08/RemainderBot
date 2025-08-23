import { GoogleGenAI } from "@google/genai";
import "dotenv/config";

import { promptAI } from "./prompt";
import { logger } from "./logger";
import { english } from "./language";

export type Task = {
  task: string;
  due: string;
  status: "pending" | "completed";
  recurrence: "one-time" | "daily" | "weekly" | "monthly" | "yearly";
  messages: string[];
};

export type TaskResponse = {
  success: boolean;
  message: string;
  tasks: Task[];
};

const apiKey = process.env.GEMINI_API_KEY;

const ai = new GoogleGenAI({ apiKey });

const failureTask: TaskResponse = {
  success: false,
  message: english.errormessage,
  tasks: [],
};

const generateContent = async (task: string) => {
  try {
    logger.info("Request for extracting data from the gemma model");
    const finalPromptToSend = `${promptAI}\n\nTask - ${task}\nOutput`;
    const response = await ai.models.generateContent({
      model: "gemma-3-27b-it",
      contents: finalPromptToSend,
    });
    const res = response.text;
    if (!res) {
      logger.error("Empty message from the gemma model");
      return failureTask;
    }
    try {
      const responseText = res
        .replace(/^```json\s*/i, "")
        .replace(/\s*```[\s\n]*$/, "");
      console.log(responseText);
      return JSON.parse(responseText);
    } catch (err) {
      console.log("Error while parsing");
      logger.error("Error while parsing tasks : ", err);
      return failureTask;
    }
  } catch (error) {
    logger.error("Error calling Gemma Model : ", error);
    return failureTask;
  }
};

export default generateContent;

