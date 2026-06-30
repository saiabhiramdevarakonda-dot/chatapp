import express from 'express';

import RagProvider from './rag.js';

import {

    geminiProvider,

    embeddingProvider

} from './providers.js';

import {

    getFaqVectors,

    isCacheReady

} from './embeddingCache.js';

const router = express.Router();

router.post('/chat', async (req, res) => {

    try {

        const { message } = req.body;

        if (!message || message.trim() === "") {

            return res.status(400).json({

                error: "Message is required"

            });

        }

        if (!isCacheReady()) {

            return res.status(500).json({

                error: "Knowledge Base not initialized"

            });

        }

        console.log("\n====================================");
        console.log("Question:", message);
        console.log("====================================");

        // Generate embedding only for user query

        const queryEmbedding =

            await embeddingProvider.generateEmbeddings(

                message

            );

        const queryVector = queryEmbedding[0];

        const faqVectors = getFaqVectors();

        const rag = new RagProvider();

        const prompt =

            rag.prepareRagPrompt(

                message,

                queryVector,

                faqVectors

            );

        console.log("\nPrompt sent to Gemini:\n");

        console.log(prompt);

        const response =

            await geminiProvider.generateResponse(

                prompt

            );

        console.log("\nGemini Response:\n");

        console.log(response);

        return res.json({

            reply: response

        });

    }

    catch (error) {

        console.error(error);

        return res.status(500).json({

            error: error.message

        });

    }

});

export default router;