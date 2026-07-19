import type { Request, Response } from 'express';
import {GEMINI} from '../services/gemini.service.ts';
import { MCPClient } from '../mcp/client/mcp-client.service.ts';
import { OPENAI } from '../services/openai.service.ts';

export class AgentController{
 static async chat(req: Request, res: Response) {
    const { message, model } = req.body;
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const selectedModel = model || 'gpt';
    try {
      const mcpClient = await MCPClient.init();
      const LLM = selectedModel === 'gemini' ? GEMINI : OPENAI;
      const response = await LLM.generateResponseWithTools(message,mcpClient.client);
      res.json({reply: response});
      /*if(selectedModel === 'gemini'){
        const response = await GEMINI.generateResponseWithTools(message,mcpClient.client);
        res.json({ reply: response });
      }
      if(selectedModel === 'gpt'){
         const response = await OPENAI.generateResponseWithTools(message,mcpClient.client);
         res.json({reply: response});
      }*/
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

