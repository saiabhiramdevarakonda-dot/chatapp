import GeminiProvider from "./geminiProvider.js";
import LocalEmbeddingProvider from "./localEmbeddingProvider.js";

const geminiProvider = new GeminiProvider(
    process.env.GEMINI_API_KEY,
    process.env.GEMINI_MODEL
);

const embeddingProvider = new LocalEmbeddingProvider();

await embeddingProvider.initialize();

export {
    geminiProvider,
    embeddingProvider
};