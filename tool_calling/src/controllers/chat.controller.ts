import type { Request, Response } from "express";
import { GEMINI } from "../services/gemini.service.ts";
import { OPENAI } from "../services/openai.service.ts";

export class ChatController {
  static async generateResponse(req: Request, res: Response) {
    const { message, provider } = req.body;

    if (!message) {
      return res.status(400).json({
        error: "Message is required",
      });
    }

    try {
      // Default provider is Gemini
      const selectedProvider = (provider || "gemini")
        .toLowerCase()
        .trim();

      const LLM =
        selectedProvider === "openai"
          ? OPENAI
          : GEMINI;

      const response =
        await LLM.generateResponseWithTools(message);

      return res.json({
        reply: response,
      });

    } catch (error: unknown) {
      console.error(error);

      let errorMessage = "Failed to generate response";
      let statusCode = 500;

      if (error instanceof Error && "status" in error) {
        statusCode = (error as any).status || 500;
        errorMessage = error.message;
      }

      return res.status(statusCode).json({
        error: errorMessage,
      });
    }
  }
}