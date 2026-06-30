import type { Request, Response } from 'express';
import {GeminiService} from '../services/gemini.service.ts';

 export class ChatController {
  static async generateResponse(req: Request, res: Response) {
    const { message } = req.body;
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }
    try {
      const gemini = GeminiService.getInstance();
      const response = await gemini.generateResponse(message);
      res.json({ reply: response });
    } catch (error: unknown) {
      console.error('Error generating response:', error);
      
      let errorMessage = 'Failed to generate response';
      let statusCode = 500;

      if (error instanceof Error && 'status' in error) {
        statusCode = (error as any).status || 500;
        errorMessage = error.message;
      }
      res.status(statusCode).json({ error: errorMessage });
    }
  }
}
