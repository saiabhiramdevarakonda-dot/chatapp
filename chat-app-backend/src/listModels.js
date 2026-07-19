import { GoogleGenerativeAI } from "@google/generative-ai";
import "dotenv/config";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function main() {
  try {
    const models = await genAI.listModels();
    console.dir(models, { depth: null });
  } catch (err) {
    console.error(err);
  }
}

main();