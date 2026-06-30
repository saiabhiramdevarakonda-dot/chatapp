import fs from 'node:fs';
import path from 'node:path';
import cosineSimilarity from "compute-cosine-similarity";

class RagProvider {

    fetchDocumentData(filename) {

        const filePath = path.join(
            process.cwd(),
            'data',
            filename
        );

        return JSON.parse(
            fs.readFileSync(filePath, 'utf-8')
        );
    }

    prepareSimpleRagPrompt(query) {

        const faqData = this.fetchDocumentData("faqs.json");
        const kbData = this.fetchDocumentData("knowledgeBase.json");

        const allData = [
            ...faqData,
            ...kbData
        ];

        const context = allData
            .map(item => `
Question:
${item.question}

Answer:
${item.answer}
`)
            .join("\n");

        return `
You are a helpful AI assistant.

Context:

${context}

User Question:

${query}

Instructions:

- Use the context whenever it answers the user's question.
- If the context is insufficient, answer using your own knowledge.
- If both are useful, combine them.
- Never say that you only answer from the provided context.

Answer:
`;
    }

    prepareSimilarRagPrompt(query) {
        return this.prepareSimpleRagPrompt(query);
    }

    prepareRagPrompt(
        query,
        queryVector,
        faqVectors
    ) {

        const ranked = faqVectors
            .map(item => ({
                ...item,
                score: cosineSimilarity(
                    queryVector,
                    item.vector
                )
            }))
            .sort((a, b) => b.score - a.score);

        const SIMILARITY_THRESHOLD = 0.45;

        const relevant = ranked.filter(
            item => item.score >= SIMILARITY_THRESHOLD
        );

        // No relevant context → Let Gemini answer normally.
        if (relevant.length === 0) {

            return query;

        }

        const context = relevant
            .slice(0, 3)
            .map(item => `
Question:
${item.question}

Answer:
${item.answer}
`)
            .join("\n");

        return `
You are a helpful AI assistant.

Relevant Context:

${context}

User Question:

${query}

Instructions:

1. Answer using the context whenever it is relevant.

2. If the context does not completely answer the question,
use your own knowledge.

3. If both are useful,
combine them naturally.

4. Never say you only answer from the provided context.

5. Give a detailed and natural response.

Answer:
`;
    }
}

export default RagProvider;