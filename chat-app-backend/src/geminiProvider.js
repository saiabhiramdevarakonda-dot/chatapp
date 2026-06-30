import { GoogleGenerativeAI } from "@google/generative-ai";

class GeminiProvider {

  constructor(apikey, modelName) {

    this.apikey = apikey?.trim();
    this.modelName = modelName?.trim();

    if (!this.apikey) {
      throw new Error(
        "API key is required for GeminiProvider"
      );
    }

    if (!this.modelName) {
      throw new Error(
        "Model name is required for GeminiProvider"
      );
    }

    console.log(
      `[GeminiProvider] Initialized with model: "${this.modelName}"`
    );

    this.genAi = new GoogleGenerativeAI(
      this.apikey
    );

    // Create Gemini model with generation configuration
    this.model = this.genAi.getGenerativeModel({

      model: this.modelName,

      generationConfig: {

        temperature: 0.7,

        topP: 0.95,

        topK: 40,

        maxOutputTokens: 2048

      }

    });

  }

  async generateResponse(prompt) {

    const maxRetries = 3;
    let attempt = 0;
    let delay = 1000;

    while (attempt < maxRetries) {

      try {

        const result =
          await this.model.generateContent(
            prompt
          );

        const response =
          result.response;

        if (
          !response.candidates ||
          response.candidates.length === 0
        ) {

          return "The AI did not return any results.";

        }

        return response.text();

      } catch (error) {

        console.error(
          `Gemini Error (attempt ${attempt + 1}/${maxRetries}):`,
          error
        );

        if (
          error.status >= 500 &&
          attempt < maxRetries - 1
        ) {

          console.log(
            `Retrying in ${delay / 1000} seconds...`
          );

          await new Promise(resolve =>
            setTimeout(resolve, delay)
          );

          delay *= 2;
          attempt++;

        } else {

          throw new Error(
            `Failed to generate response: ${error.message}`
          );

        }

      }

    }

  }

  async generateEmbeddings(
    data,
    taskType = "RETRIEVAL_QUERY"
  ) {

    try {

      const response =
        await this.genAi.models.embedContent({

          model: "gemini-embedding-001",

          content: data,

          taskType

        });

      const embeddings =
        response.embeddings.map(
          e => e.values
        );

      return embeddings;

    } catch (error) {

      console.error(
        "Gemini Embedding Error:",
        error
      );

      throw new Error(
        `Failed to generate embeddings: ${error.message}`
      );

    }

  }

}

export default GeminiProvider;