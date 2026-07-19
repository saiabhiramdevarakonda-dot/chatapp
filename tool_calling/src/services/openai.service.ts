import { OpenAI } from "openai";
import { WeatherService } from "./weather.service.ts";
import { customerService } from "./customer.service.ts";
import type { ResponseInput, Tool } from "openai/resources/responses/responses.mjs";

class OpenaiService {
  private static instance: OpenaiService;
  private readonly modelName: string;
  private readonly openAI: OpenAI;

  constructor(modelName: string = process.env.OPENAI_MODEL!) {
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

  async callLLM(
    contents: string | ResponseInput,
    tools: Tool[] | undefined,
    instructions?: string,
  ) {
    try {
      const response = await this.openAI.responses.create({
        model: this.modelName,
        input: contents,
        tools: tools,
        instructions,
      });

      return response;
    } catch (error: any) {
      console.error("Error generating response:", error);
      throw new Error(`Error generating response: ${error.message}`);
    }
  }

  async generateResponseWithTools(prompt: string): Promise<string> {
    try {
      const getWeatherFn: Tool = {
        type: "function",
        name: "get_current_weather",
        description: "Fetches live weather data for a given location.",
        strict: true,
        parameters: {
          type: "object",
          properties: {
            location: {
              type: "string",
              description:
                "City or region to fetch weather for, e.g., 'Mumbai India' or 'New York'.",
            },
          },
          required: ["location"],
          additionalProperties: false,
        },
      };

      const getCustomersFn: Tool = {
     type: "function",
     name: "get_all_customers",
     description:
     "Returns customer records from the application's customer database. Use this whenever the user asks about customers, latest customers, recent customers, customer list, or customer information.",
     strict: true,
     parameters: {
     type: "object",
     properties: {
      limit: {
        type: ["number","null"],
        description: "Number of recent customers to return."
      },
    },
    required: ["limit"],
    additionalProperties: false,
  }
};

      const tools = [getWeatherFn, getCustomersFn,];

      let input: ResponseInput = [{
        role: "user",
        content: prompt,
      }];
      const response = await this.callLLM(input, tools);
     //handle function calls if any
     for(const items of response.output) {
      if(items.type !== "function_call") continue;
        const {name, arguments: rawargs, call_id} = items;
        const args = rawargs ? JSON.parse(rawargs) : {}; 

        let result: any;

        switch (name) {
          case "get_current_weather": {
            result = await WeatherService.fetchWeatherData(args?.location);
            console.log("Weather result:", result);
            break;
          }
          case "get_all_customers": {
            const limit = (args as { limit: number })?.limit;
            console.log("Limit received:", limit);
            result = await customerService.getLatestCustomers(args?.limit);
            console.log("Customers result:", result);
            break;
          }
            default:
              throw new Error(`Unknown function: ${name}`);
        }
        // send result back to the LLM for further processing
        
        input.push({
            type: "function_call_output",
            call_id,
            output: JSON.stringify(result)
        });
    }
    //final call to LLM with all the function call outputs
    const instructions = "Respond clearly using the tool output.";
    const finalResponse = await this.callLLM(input, tools, instructions);

    return finalResponse.output_text || "No response generated.";
 
    } catch (error: any) {  
    console.error("Error generating response with tools:", error);
    throw new Error(`Error generating response with tools: ${error.message}`);
  }
}
}
export const OPENAI = OpenaiService.getInstance();