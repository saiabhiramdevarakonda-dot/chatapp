import OpenAI from "openai";

class OpenaiProvider {

    constructor(apiKey, modelname) {

        this.apiKey = apiKey;
        this.modelname = modelname;

        if (!this.apiKey) {
            throw new Error(
                "API key is required for OpenaiProvider"
            );
        }

        if (!this.modelname) {
            throw new Error(
                "Model name is required for OpenaiProvider"
            );
        }

        this.openai = new OpenAI({
            apiKey: this.apiKey,
        });
    }

    async generateResponse(prompt) {

        try {

            const response =
                await this.openai.responses.create({
                    model: this.modelname,
                    input: prompt,
                });

            return (
                response.output_text ||
                "No response generated."
            );

        } catch (error) {

            console.error(
                "Error generating response:",
                error
            );

            throw new Error(
                `Failed to generate response: ${error.message}`
            );
        }
    }

    async generateEmbeddings(data) {

        try {

            const response =
                await this.openai.embeddings.create({
                    model: "text-embedding-3-small",
                    input: data,
                    encoding_format: "float",
                });

            return response.data.map(
                e => e.embedding
            );

        } catch (error) {

            console.error(
                "Error generating embedding:",
                error
            );

            throw new Error(
                `Failed to generate embedding: ${error.message}`
            );
        }
    }
}

export default OpenaiProvider;