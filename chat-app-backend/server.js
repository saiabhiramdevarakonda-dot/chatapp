import 'dotenv/config';
import express from 'express';
import cors from 'cors';

import chatRouter from './src/chatRouter.js';
import RagProvider from './src/rag.js';
import { embeddingProvider } from './src/providers.js';
import { setFaqVectors } from './src/embeddingCache.js';

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Chat App Backend is running');
});

async function initializeEmbeddings() {

    console.log("\n==================================");
    console.log("Initializing Knowledge Base...");
    console.log("==================================");

    const rag = new RagProvider();

    const faqData = [

        ...rag.fetchDocumentData("faqs.json"),

        ...rag.fetchDocumentData("knowledgeBase.json")

    ];

    console.log(`Loaded ${faqData.length} documents`);

    const embeddings =
        await embeddingProvider.generateEmbeddings(

            faqData.map(item =>

                `${item.question}

${item.answer}`

            )

        );

    const faqVectors = faqData.map((item, index) => ({

        ...item,

        vector: embeddings[index]

    }));

    setFaqVectors(faqVectors);

    console.log(`Cached ${faqVectors.length} vectors`);
    console.log("Knowledge Base Ready");
    console.log("==================================\n");
}

app.use('/api', chatRouter);

app.use((err, req, res, next) => {

    console.error(err);

    res.status(500).json({

        error: "Internal Server Error"

    });

});

const PORT = process.env.PORT || 3000;

initializeEmbeddings()
.then(() => {

    app.listen(PORT, () => {

        console.log(`Server restarted on http://localhost:${PORT}`);

    });

})
.catch(err => {

    console.error("Initialization Failed");

    console.error(err);

});