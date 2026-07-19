# Chroma
## install chroma locally in project
npm install chromadb @chroma-core/default-embed

# to run chroma
chroma run --path src/vector-data

# pg vector
postgres=# CREATE EXTENSION IF NOT EXISTS vector;
CREATE EXTENSION
postgres# CREATE DATABASE rag_vector_db;
CREATE DATABASE
postgres=# \c rag_vector_db;
You are now connected to database "rag_vector_db" as user "postgres".
ragdb#