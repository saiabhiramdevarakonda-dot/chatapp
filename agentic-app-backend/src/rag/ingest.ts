import path from "node:path";
import { VectoreStore } from "./vectorStore/vector.store.ts";
import fs from 'node:fs'
import { GEMINI } from "../services/gemini.service.ts";
import { randomUUID } from "node:crypto";
const CHUNK_SIZE = Number(process.env.RAG_CHUNK_SIZE) || 800;
const CHUNK_OVERLAP = Number(process.env.RAG_CHUNK_OVERLAP) || 100;

function chunkText(text : string): string[] {
    const chunk: string[] = [];
    let i = 0;

    while (i < text.length) {
    const end = Math.min(text.length, i + CHUNK_SIZE);
    chunk.push(text.slice(i, end));
    i+= CHUNK_SIZE - CHUNK_OVERLAP;
    }
    return chunk;
}

export async function ingestFolder(folderPath: string){
    const Store = VectoreStore.get();

    await Store?.init();

    const files = fs.readdirSync(folderPath);
    
    for (const file of files) {
        if(!file.endsWith(".md") && !file.endsWith(".txt")) continue;
        const filePath = path.join(folderPath, file);
        const rawData = fs.readFileSync(filePath, 'utf8');

        const chunks = chunkText(rawData);

    const embeddings =  await GEMINI.generateEmbeddings(chunks);

    for(let i=0; i < chunks.length; i++){
        await Store?.upsert({
              id: randomUUID(),
              docId: file,
              chunkIndex: i,
              text: chunks[i],
              embedding: embeddings[i]!,
              metadata: {
                     source: filePath
                              }
         });
    }

    console.log(`Ingested ${file}`);
  }
}

if(import.meta.url.includes('ingest')){
    const folder  = process.argv[2];
  
    if(!folder){
        console.log('usage: node src/rag/ingest.ts src/data/rag_docs');
        process.exit(1);
    
    }
    ingestFolder(folder);

}