import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

async function main() {
  let retries = 5;

  while (retries--) {
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3.1-flash-lite",
        contents: "Say hello",
      });

      console.log(response.text);
      return;
    } catch (err) {
      console.log(err.status, err.message);

      if (err.status === 503 && retries > 0) {
        console.log("Retrying in 5 seconds...");
        await new Promise(resolve => setTimeout(resolve, 5000));
      } else {
        throw err;
      }
    }
  }
}

main();