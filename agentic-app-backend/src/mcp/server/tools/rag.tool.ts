import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp";
import { z } from "zod";

import { RagEngine } from "../../../rag/ragEngine.ts";

export function registerRagTool(mcpServer: McpServer) {
    console.log("Registering RAG tool...");

    mcpServer.registerTool(
        "ragSearch",
        {
            title: "RAG SEARCH",
            description: "Retrieve relevant context from vector store for a user query",
            inputSchema: {
                query: z.string(),
                topK: z.number().optional(),
            },
            outputSchema: {
                prompt: z.string(),
                sources: z.any(),
            },
        }, // <-- THIS COMMA WAS MISSING
        async ({ query, topK }) => {

            console.log("RAG Query:", query);

            try {
                const result = await RagEngine.buildPrompt(query, topK);

                return {
                    content: [
                        {
                            type: "text",
                            text: result.prompt,
                        },
                    ],
                    structuredContent: {
                        prompt: result.prompt,
                        sources: result.sources,
                    },
                };
            } catch (error: any) {
                console.error("RAG TOOL ERROR:", error);

                return {
                    content: [
                        {
                            type: "text",
                            text: "RAG ERROR: " + error.message,
                        },
                    ],
                    structuredContent: {
                        prompt: error.message,
                        sources: [],
                    },
                };
            }
        }
    );
}