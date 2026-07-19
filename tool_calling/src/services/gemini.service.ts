import {
  FunctionCallingConfigMode,
  GoogleGenAI,
  Type,
  type ContentListUnion,
  type ToolListUnion,
} from "@google/genai";
import { WeatherService } from "./weather.service.ts";
import { customerService } from "./customer.service.ts";

class GeminiService {
  private static instance: GeminiService;
  private readonly modelName: string;
  private readonly genAI: GoogleGenAI;

  constructor(modelName: string = process.env.GEMINI_MODEL!) {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      throw new Error("API key is required");
    }

    if (!modelName) {
      throw new Error("Model name is required");
    }

    this.modelName = modelName;
    
    this.genAI = new GoogleGenAI({ apiKey });
  }

  static getInstance(modelName?: string): GeminiService {
    if (!this.instance) {
      this.instance = new GeminiService(modelName);
    }
    return this.instance;
  }

  async generateResponse(prompt: string): Promise<string> {
    try {
      const response = await this.genAI.models.generateContent({
        model: this.modelName,
        contents: prompt,
      });

      return response.text || "No response generated.";
    } catch (error: any) {
      console.error("Error generating response:", error);
      throw new Error(`Error generating response: ${error.message}`);
    }
  }

  async generateEmbeddings(
    data: string | string[],
    taskType = "RETRIEVAL_QUERY"
  ) {
    try {
      const response = await this.genAI.models.embedContent({
        model: "gemini-embedding-001",
        contents: data,
        config: {
          taskType,
        },
      });

      return response.embeddings!.map((e) => e.values);
    } catch (error: any) {
      console.error("Error generating embeddings:", error);
      throw new Error(`Error generating embeddings: ${error.message}`);
    }
  }

  async callLLM(
    contents: ContentListUnion,
    tools: ToolListUnion | undefined
  ) {
    try {
      const response = await this.genAI.models.generateContent({
        model: this.modelName,
        contents,
        config: {
          tools,
          toolConfig: {
            functionCallingConfig: {
              mode: FunctionCallingConfigMode.AUTO,
            },
          },
        },
      });

      return response;
    } catch (error: any) {
      console.error("Error generating response:", error);
      throw new Error(`Error generating response: ${error.message}`);
    }
  }

  async generateResponseWithTools(prompt: string): Promise<string> {
    try {
      const getWeatherFn = {
        name: "get_current_weather",
        description: "Fetches live weather data for a given location.",
        parameters: {
          type: Type.OBJECT,
          properties: {
            location: {
              type: Type.STRING,
              description:
                "City or region to fetch weather for, e.g., 'Mumbai India' or 'New York'.",
            },
          },
          required: ["location"],
        },
      };

      const getCustomersFn = {
    name: "get_all_customers",
    description:
     "Returns customer records from the application's customer database. Use this whenever the user asks about customers, latest customers, recent customers, customer list, or customer information.",
     parameters: {
     type: Type.OBJECT,
     properties: {
      limit: {
        type: Type.INTEGER,
        description: "Number of recent customers to return."
      }
    }
  }
};

      const tools = [
        {
          functionDeclarations: [getWeatherFn, getCustomersFn],
        },
      ];

      const response = await this.callLLM(prompt, tools);
     
      if (response.functionCalls && response.functionCalls.length > 0) {
        const fnCall = response.functionCalls[0];
        const { name, args } = fnCall;

        let result: any;

        switch (name) {
          case "get_current_weather": {
            const location = (args as { location: string }).location;

            if (typeof location !== "string") {
              throw new Error("Invalid location");
            }

            result = await WeatherService.fetchWeatherData(location);
            break;
          }

          case "get_all_customers": {
            const limit = (args as { limit: number })?.limit;
            console.log("Limit received:", limit);
            result = await customerService.getLatestCustomers(limit);
            break;
          }

          default:
            throw new Error(`Unknown function: ${name}`);
        }

        const responseFollowUp = await this.callLLM(
          [
            {
              role: "user",
              parts: [{ text: prompt }],
            },
            {
              role: "user",
              parts: [
                {
                  functionResponse: {
                    name,
                    response: { result },
                  },
                },
              ],
            },
          ],
          tools
        );

        return responseFollowUp.text || "No response generated.";
      }

     if(response.functionCalls && response.functionCalls.length === 0) {
      const fnCall = response.functionCalls[0];
      const { name, args } = fnCall;
      let result: any;

      switch (name) {
        case "get_current_weather": {
          const location = (args as { location: string }).location;
          if (typeof location !== "string") {
            throw new Error("Invalid location");
          }
          result = await WeatherService.fetchWeatherData(location);
          console.log("Weather result:", result);
          break;
        }
        case "get_all_customers": {
         result = await customerService.getLatestCustomers();
         console.log("Customers result:", result);
         break;
        }
        default:
          throw new Error(`Unknown function: ${name}`);
      }
      if (!result) {
        throw new Error(`No result returned from function: ${name}`);
      }
     const responseFollowUp = await this.callLLM(
  [
    {
      role: "user",
      parts: [{ text: prompt }],
    },
    {
      role: "user",
      parts: [
        {
          functionResponse: {
            name,
            response: { result },
          },
        },
      ],
    },
  ],
  tools
);

return responseFollowUp.text || "No response generated.";
}
      return response.text || "No response generated.";
    } catch (error: any) {
      console.error("Error generating response:", error);
      throw new Error(`Error generating response: ${error.message}`);
    }
  }
}

export const GEMINI = GeminiService.getInstance();