import { GoogleGenAI } from "@google/genai";

class GeminiProvider {
  constructor(apiKey, modelName) {
    this.apiKey = apiKey?.trim();
    this.modelName = modelName?.trim();

    if (!this.apiKey) {
      throw new Error("API key is required.");
    }

    if (!this.modelName) {
      throw new Error("Model name is required.");
    }

    this.ai = new GoogleGenAI({
      apiKey: this.apiKey,
    });
  }

  async generateResponse(prompt) {
    const maxRetries = 3;
    let retry = 0;
    let delay = 2000;

    while (retry < maxRetries) {
      try {
        const response = await this.ai.models.generateContent({
          model: this.modelName,
          contents: prompt,
          config: {
            temperature: 0.7,
            topP: 0.95,
            topK: 40,
            maxOutputTokens: 2048,
          },
        });

        return response.text || "No response generated.";
      } catch (error) {
        if (
          (error.status === 429 || error.status === 503) &&
          retry < maxRetries - 1
        ) {
          await new Promise((resolve) =>
            setTimeout(resolve, delay)
          );

          retry++;
          delay *= 2;
          continue;
        }

        throw new Error(
          `Failed to generate response: ${
            error?.message || "Unknown Gemini error"
          }`
        );
      }
    }

    throw new Error("Maximum retries exceeded.");
  }

  async generateEmbeddings(
    data,
    taskType = "RETRIEVAL_QUERY"
  ) {
    try {
      const response = await this.ai.models.embedContent({
        model: "gemini-embedding-001",
        contents: data,
        config: {
          taskType,
        },
      });

      if (!response.embeddings || response.embeddings.length === 0) {
        throw new Error("No embeddings generated.");
      }

      return response.embeddings.map(
        (embedding) => embedding.values
      );
    } catch (error) {
      throw new Error(
        `Failed to generate embeddings: ${
          error?.message || "Unknown Gemini error"
        }`
      );
    }
  }
}

export default GeminiProvider;