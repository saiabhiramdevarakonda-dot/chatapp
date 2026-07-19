import {
  GoogleGenAI,
  mcpToTool,
} from "@google/genai";

import type { Client } from "@modelcontextprotocol/sdk/client";

class GeminiService {
  private static instance: GeminiService;

  private ai: GoogleGenAI;
  private modelName: string;

  private constructor(modelName: string = process.env.GEMINI_MODEL!) {
    const apiKey = process.env.GEMINI_API_KEY!;

    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is missing");
    }

    if (!modelName) {
      throw new Error("GEMINI_MODEL is missing");
    }

    this.modelName = modelName;

    this.ai = new GoogleGenAI({
      apiKey,
    });

    console.log(
      `[GeminiService] Using model ${this.modelName}`
    );
  }

  static getInstance() {
    if (!GeminiService.instance) {
      GeminiService.instance = new GeminiService();
    }

    return GeminiService.instance;
  }

  async generateResponse(prompt: string): Promise<string> {
    const response = await this.ai.models.generateContent({
      model: this.modelName,

      contents: [
        {
          role: "user",
          parts: [
            {
              text: prompt,
            },
          ],
        },
      ],
    });
    /*console.log(
  JSON.stringify(response, null, 2)
);*/

    return response.text ?? "";
  }

  async generateResponseWithTools(
  prompt: string,
  mcpClient: Client
): Promise<string> {

  const response = await this.ai.models.generateContent({
    model: this.modelName,

    contents: [
      {
        role: "user",
        parts: [
          {
            text: prompt,
          },
        ],
      },
    ],

    config: {
      systemInstruction: {
        role: "system",
        parts: [
          {
            text: `
You are an intelligent AI assistant with access to external tools through the Model Context Protocol (MCP).

Your goal is to provide accurate, helpful, and trustworthy responses by selecting the most appropriate tool when needed. Do not use tools unnecessarily.

# Available Capabilities

You can access:

- MCP Tools
  - Order Management
  - Customer Management
  - Weather Information
  - Database Operations
  - Any additional MCP tools registered at runtime

- RAG Search
  - Company knowledge base
  - Product documentation
  - Internal documentation
  - FAQs
  - Policies
  - Manuals
  - Uploaded documents

- Large Language Model (General Knowledge)
  - Programming
  - Science
  - Mathematics
  - Technology
  - Health and fitness
  - History
  - Geography
  - Writing
  - General reasoning
  - General world knowledge

--------------------------------------------------
TOOL SELECTION RULES
--------------------------------------------------

Before answering, determine whether a tool is actually required.

Use MCP tools when the user asks about:

- orders
- customers
- weather
- products
- inventory
- business records
- application data
- database information
- company operations

Use the RAG tool ONLY when the question is about:

- company documentation
- company policies
- internal knowledge
- employee documentation
- product documentation
- uploaded files
- manuals
- technical documentation
- FAQs stored in the knowledge base

Do NOT use RAG for:

- programming questions
- mathematics
- science
- health
- fitness
- nutrition
- history
- geography
- language learning
- interview questions
- coding help
- general AI questions
- general world knowledge
- casual conversation

Answer these directly using your own knowledge.

--------------------------------------------------
MULTIPLE TOOLS
--------------------------------------------------

If multiple tools are required:

- Use every relevant tool.
- Combine the results into one natural response.
- Clearly distinguish information from different sources when necessary.

--------------------------------------------------
DATABASE RULES
--------------------------------------------------

Never:

- generate SQL
- expose SQL queries
- assume schemas
- fabricate database records

Always retrieve database information through MCP tools.

--------------------------------------------------
RAG RULES
--------------------------------------------------

When using RAG:

1. Search the knowledge base.
2. Use retrieved context as the primary source.
3. Cite or summarize only retrieved information.
4. Never invent missing documentation.

If RAG returns no relevant documents:

- Do NOT say "I don't have enough information."
- Do NOT refuse the question automatically.
- If the user's question is a general knowledge question, answer it using your own knowledge.
- Only state that the knowledge base has no relevant information when the user specifically asks about company or internal documentation.

--------------------------------------------------
GENERAL KNOWLEDGE
--------------------------------------------------

You are allowed to answer general knowledge questions directly without using any tools.

Examples:

✔ What is Python?
✔ How do I lose weight?
✔ Explain calorie deficit.
✔ What is machine learning?
✔ Explain transformers.
✔ What is an API?

These should be answered from your own knowledge unless the user explicitly asks about company documentation.

--------------------------------------------------
RESPONSE STYLE
--------------------------------------------------

- Be concise and accurate.
- Prefer tool results whenever tools are appropriate.
- Prefer general reasoning when tools are unnecessary.
- Never fabricate tool outputs.
- Never fabricate database records.
- Never fabricate RAG results.
- If a tool fails, explain the failure and continue with general knowledge only if appropriate.
            `,
          },
        ],
      },

      thinkingConfig: {
        thinkingBudget: 0,
      },

      tools: [
        mcpToTool(mcpClient),
      ],
    },
  });

  

  return this.extractResponseText(response);
}
   private extractResponseText(response: any): string {

  const candidate = response?.candidates?.[0];

  if (!candidate) {
    return "";
  }

  const parts = candidate.content?.parts ?? [];

  for (const part of parts) {

    if (part.text) {
      return part.text.trim();
    }

    if (part.functionResponse?.response?.structuredContent) {
      return JSON.stringify(
        part.functionResponse.response.structuredContent,
        null,
        2
      );
    }

    if (part.functionResponse?.response) {
      return JSON.stringify(
        part.functionResponse.response,
        null,
        2
      );
    }
  }

  return response.text ?? "";
}

  async generateEmbeddings(
    data: string | string[]
  ): Promise<number[][]> {

    const texts = Array.isArray(data)
      ? data
      : [data];

    const embeddings: number[][] = [];

    for (const text of texts) {
      const result = await this.ai.models.embedContent({
        model: "gemini-embedding-001",

        contents: text,

        config: {
          taskType: "RETRIEVAL_DOCUMENT",
        },
      });

     if (
  result.embeddings &&
  result.embeddings.length > 0 &&
  result.embeddings[0].values
) {
  embeddings.push(result.embeddings[0].values);
} else {
  throw new Error("Embedding generation failed.");
}
    }

    return embeddings;
  }
}

export const GEMINI = GeminiService.getInstance();