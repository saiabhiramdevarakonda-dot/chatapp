import {VectorStoreChroma} from "./dbs/chroma.db.ts"
import { VectorStorePg } from "./dbs/pgvector.db.ts"

export class VectoreStore{
    static get(){
        const backend = process.env.VECTOR_DB || 'chroma';

        if(backend === 'chroma') return VectorStoreChroma;
        if(backend === 'pgvector') return VectorStorePg;

        throw new Error("Invalid VECTOR_DB value. Use pgvector or chroma.")

    }
}