import {Pool} from 'pg';
import pgvector from 'pgvector/pg';


const pool = new Pool({
    connectionString: process.env.POSTGRES_URL,
});

pool.on('connect', async (client) => {
    console.log('Connected to PostgreSQL');
    await client.query('CREATE EXTENSION IF NOT EXISTS vector');
    await pgvector.registerTypes(client);
});
export class VectorStorePg{
    private static initialized = false;
    private static table = process.env.PGVECTOR_TABLE || 'rag_vectors';
    private static dims = Number(process.env.EMBEDDING_DIMS) || 3072;

    static async init(){
        if(this.initialized) return;
        this.initialized = true;
        
        console.log("RAG (pgvector): Initializing vector store...");

        await pool.query(`
            CREATE TABLE IF NOT EXISTS ${this.table} (
                id TEXT PRIMARY KEY,
                doc_id TEXT ,
                chunk_index INT,
                context TEXT ,
                metadata JSONB,
                embedding vector(${this.dims})
            )
        `);
        console.log("pgvector: skipping all indexes(3072 dims exceed index limits)");
    
    }

    static async upsert(params:{
        id: string,
        docId: string,
        chunkIndex: number,
        text: string,
        embedding: number[],
        metadata?: any
      }){
        const {id, docId, chunkIndex, text, embedding, metadata = {}} = params;
        
        if(embedding.length !== this.dims){
            throw new Error(
                `Embedding dimension mismatch. Expected ${this.dims} but got ${embedding.length}`
            );
        }

        await pool.query(`
            INSERT INTO ${this.table} (id, doc_id, chunk_index, context, metadata, embedding)
            VALUES ($1, $2, $3, $4, $5, $6) ON CONFLICT (id) DO UPDATE SET
            context = EXCLUDED.context,
            metadata = EXCLUDED.metadata,
            embedding = EXCLUDED.embedding`
            , [id, docId, chunkIndex, text, JSON.stringify(metadata),pgvector.toSql(embedding)],
        
        );
    }

    static async search(embedding: number[], topk: number = 4){
        const result = await pool.query(`
            SELECT id, doc_id, chunk_index, context, metadata, embedding <=> $1 AS
            distance
            FROM ${this.table}
            ORDER BY embedding <=> $1
            LIMIT $2
             `, [pgvector.toSql(embedding), topk]);

             return result.rows.map((row) => ({
                id: row.id,
                text: row.context,
                metadata:{
                    docId: row.doc_id,
                    chunkIndex: row.chunk_index,
                    ...row.metadata,
                },
               score: row.distance,
             }));
      }
    }

    
