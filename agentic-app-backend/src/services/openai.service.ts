import  OpenAI  from "openai";
import type { Client } from "@modelcontextprotocol/sdk/client";
import {zodTextFormat}  from "openai/helpers/zod.mjs";
import {z} from "zod";
const JsonPrimitive = z.union([z.string(),z.number(),z.boolean(),z.null()]);
const ToolArgumentSchema = z.record(z.string(),JsonPrimitive);
 

const ToolIntentSchema = z.object({
action: z.enum(["final","tool"]),
tool: z.string().nullable(),
arguments: ToolArgumentSchema.nullable(),
output: z.string().nullable(),
}).refine(
  (v) => (v.action === 'tool' && v.tool!== null && v.arguments !==null) ||
  (v.action === 'final' && v.output !== null),{
    message: "Invalid Intent Shape",
  }
);

class OpenaiService {
  private static instance: OpenaiService;
  private readonly modelName: string;
  private readonly openAI: OpenAI;
  private readonly MAX_STEPS = 6;

  constructor(modelName: string = process.env.OPENAI_MODEL || 'gpt-5-nano') {
    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      throw new Error("API key is required");
    }

    if (!modelName) {
      throw new Error("Model name is required");
    }

    this.modelName = modelName;
    
    this.openAI = new OpenAI({ apiKey });
  }

  static getInstance(modelName?: string): OpenaiService {
    if (!this.instance) {
      this.instance = new OpenaiService(modelName);
    }
    return this.instance;
  }

  async generateResponse(prompt: string): Promise<string> {
    try {
      const response = await this.openAI.chat.completions.create({
        model: this.modelName,
        messages: [{ role: "user", content: prompt }],
      });

      return response.choices[0].message.content || "No response generated.";
    } catch (error: any) {
      console.error("Error generating response:", error);
      throw new Error(`Error generating response: ${error.message}`);
    }
  }

  async generateEmbeddings(
    data: string | string[],
  ) {
    try {
      const response = await this.openAI.embeddings.create({
        model: "gemini-embedding-001",
        input: data,
        encoding_format: "float"
      });

      const embeddings = response.data.map((e) => e.embedding);
      return embeddings;
    } catch (error: any) {
      console.error("Error generating embeddings:", error);
      throw new Error(`Error generating embeddings: ${error.message}`);
    }
  }


  async generateResponseWithTools(prompt: string, mcpClient: Client): Promise<string> {
    

    const mcptools= await mcpClient.listTools();
        const toolContext = mcptools.tools.map(t => ({
            name: t.name,
            description:t.description,
            inputSchema: t.inputSchema,
            outputSchema:t.outputSchema,
        }));
        const systemInstruction = `
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
            `;
        
        const reponseContract= `You Must Always repond in valid JSON
           if no tool is required:
           {
           'action': 'final",
           "tool": 'null',
           "output":'<reponse>}
           if a tool IS required:{
           "action":'tool',
           "tool":'<tool_name>,
           "arguments":{
           //tool-speicific arguments here
           },
           "output":null
           }
           NEVER RESPONS WITH PLAIN TEXT.
           `;

        let message: any[]=[
          {
            role:'developer',content:systemInstruction
          },
          {
            role:'developer',content:reponseContract
          },
          {
            role:'developer',content:`available tools:${JSON.stringify(toolContext,null,2)}`
          },
          {
            role:'user',content: prompt
          },
        ];
      for(let step = 0; step< this.MAX_STEPS;step++){
         let intent;
        try {
          const response = await this.openAI.responses.parse({
            model: this.modelName,
            input: message,
            text:{
              format: zodTextFormat(ToolIntentSchema,'intent'),
            }
          });
          if(!response.output_parsed){
            throw new Error("Failed to parse response");
          }
           intent =response.output_parsed;
          
        
      } catch (error: any) {  
          console.error("Error generating response with tools:", error);
          throw new Error(`Error generating response with tools: ${error.message}`);
         }
        if(intent.action === 'tool'){
          const result  = await mcpClient.callTool({
            name: intent.tool!,
            arguments: intent.arguments!,
          });
           message.push({
            role:  "assistant",
            content: JSON.stringify(intent)
           });
          message.push({
          role: "developer",
           content: `
            MCP tool "${intent.tool}" executed.

            Structured Output:
             ${JSON.stringify(result.structuredContent, null, 2)}
                  `
               });
           continue;
        }
        
       if (intent.action === "final") {
    return intent.output!;
}
}

throw new Error("Maximum tool execution steps exceeded.");
}
}

export const OPENAI = OpenaiService.getInstance();