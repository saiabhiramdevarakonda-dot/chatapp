import { pipeline } from '@xenova/transformers';

class LocalEmbeddingProvider {

  constructor() {
    this.extractor = null;
  }

  async initialize() {

    if (!this.extractor) {

      console.log(
        'Loading embedding model...'
      );

      this.extractor =
        await pipeline(
          'feature-extraction',
          'Xenova/all-MiniLM-L6-v2'
        );

      console.log(
        'Embedding model loaded'
      );
    }
  }

  async generateEmbeddings(data) {

    await this.initialize();

    const texts =
      Array.isArray(data)
        ? data
        : [data];

    const embeddings = [];

    for (const text of texts) {

      const result =
    await this.extractor(text, {
        pooling: 'mean',
        normalize: true
    });

embeddings.push(
    Array.from(result.data)
);
}

return embeddings;
}
}

export default LocalEmbeddingProvider;