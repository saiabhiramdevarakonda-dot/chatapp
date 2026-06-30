import { GoogleGenerativeAI, GenerativeModel, type EmbedContentRequest, TaskType } from "@google/generative-ai";

export class GeminiService {
  private static instance: GeminiService;
  private apikey: string;
  private modelName: string;
  private genAi: GoogleGenerativeAI;
  private model: GenerativeModel;
  private embeddingModel: GenerativeModel;

  private constructor(apikey: string, modelName: string) {

    this.apikey =
      apikey?.trim();

    this.modelName =
      modelName?.trim();

    if (!this.apikey) {

      throw new Error(
        "API key is required for GeminiService"
      );
    }

    if (!this.modelName) {

      throw new Error(
        "Model name is required for GeminiService"
      );
    }

    console.log(
      `[GeminiService] Initialized with model: "${this.modelName}"`
    );

    this.genAi =
      new GoogleGenerativeAI(
        this.apikey
      );

    const embeddingModelName = process.env.GEMINI_EMBEDDING_MODEL_NAME || "text-embedding-004";
    this.embeddingModel = this.genAi.getGenerativeModel({ model: embeddingModelName });


    this.model =
      this.genAi.getGenerativeModel({
        model: this.modelName
      });
  }

  public static getInstance(): GeminiService {
    if (!GeminiService.instance) {
      if (!process.env.GEMINI_API_KEY || !process.env.GEMINI_MODEL_NAME) {
        throw new Error("GEMINI_API_KEY and GEMINI_MODEL_NAME must be set in environment variables.");
      }
      GeminiService.instance = new GeminiService(process.env.GEMINI_API_KEY, process.env.GEMINI_MODEL_NAME);
    }
    return GeminiService.instance;
  }

  async generateResponse(prompt: string): Promise<string> {

    try {

      // Get a clean model instance to ensure no default tools are attached
      const model = this.genAi.getGenerativeModel({ model: this.modelName });

      const result = await model.generateContent(prompt);

      const response =
        result.response;

      if (
        !response.candidates ||
        response.candidates.length === 0
      ) {

        return (
          "The AI did not return any results."
        );
      }

      return response.text;

    } catch (error: any) {

      console.error(
        "Gemini Error:",
        error
      );

      throw new Error(
        `Failed to generate response: ${error.message}`
      );
    }
  }

  async generateEmbeddings(data: string | string[], taskType: TaskType): Promise<number[][]> {
  try
  {
    const requests: EmbedContentRequest[] = (Array.isArray(data) ? data : [data]).map(text => ({
      content: { role: "user", parts: [{ text }] },
      taskType: taskType,
    }));

    const result = await this.embeddingModel.batchEmbedContents({ requests });
    return result.embeddings.map(e => e.values);

  } catch (error: any) {
    console.error(
      "Gemini Embedding Error:",
      error
    );
    throw new Error(
      `Failed to generate embeddings: ${error.message}`
    );}
  }
}
