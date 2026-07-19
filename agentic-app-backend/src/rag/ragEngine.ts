import { GEMINI } from "../services/gemini.service.ts";
import { VectoreStore } from "./vectorStore/vector.store.ts";

interface RagChunk{
    id: string;
    text: string;
    metadata: any;
    score: number | null;
}
export class RagEngine {
    static async buildPrompt(query: string, topK: number = 4) {
        try {
            const Store = VectoreStore.get();
            

            await Store.init();
            console.log("RAG Vector store initialized");

            console.log("RAG: Generating embeddings...");

            // Generate embeddings (returns number[][])
            const embeddings = await GEMINI.generateEmbeddings([query]);
            const queryEmbedding = embeddings[0];
            console.log("RAG: EMBEDDINGS VALUE:", queryEmbedding);

            // Extract the first embedding (number[])
            

            if (!queryEmbedding) {
                throw new Error("RAG: No embeddings generated for query");
            }

            console.log("RAG: Embeddings generated");

            if (queryEmbedding.length !== Number(process.env.EMBEDDING_DIMS)) {
                throw new Error(
                    `RAG: Embedding dimension mismatch. Expected ${process.env.EMBEDDING_DIMS} but got ${queryEmbedding.length}`
                );
            }

            console.log("RAG: Searching vector DB...");

            const results = await Store.search(queryEmbedding, topK);

            if(!results?.length){
                return{
                    prompt:' no matching documnets found for query: ${query}',
                    sources: [],
                }; 
            }

            const context = results.map((r: RagChunk, i: number) => `SOURCE ${i + 1}
            : \n${r.text}\nMETA: ${JSON.stringify(r.metadata)}}`).join('\n\n');

            const prompt = `
            you are an ai assiatant answers only using information in the context.
            if the answer is not present , reply: ' id ont have enough information.
            
            context: 
            ${context}
            
            question:
            ${query}
            
            answer:
            `;

            return {prompt,sources: results};

        } catch (error) {
            console.error("RAG PIPELINE ERROR:", error);
            throw error;
        }
    }
}