import { OpenAI } from "openai";
import { Pinecone } from "@pinecone-database/pinecone";

// Type definitions
interface EmbeddingResponse {
  data: Array<{
    embedding: number[];
  }>;
}

interface PineconeMatch {
  metadata?: {
    text?: string;
  };
}

interface PineconeQueryResult {
  matches?: PineconeMatch[];
}

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

const pinecone = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY!,
});

const index = pinecone.index(process.env.PINECONE_INDEX!);

export async function getRelevantChunks(query: string, topK: number = 3) {
  try {
    // Skip context retrieval for very short queries to improve speed
    if (!query || query.length < 3) {
      return [];
    }

    // Step 1: Embed the query with timeout
    const embeddingPromise = openai.embeddings.create({
      model: "text-embedding-3-small",
      input: query,
    });

    // Add timeout to prevent hanging
    const queryEmbedding = (await Promise.race([
      embeddingPromise,
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Embedding timeout")), 3000)
      ),
    ])) as EmbeddingResponse;

    const embedding = queryEmbedding.data[0].embedding;

    // Step 2: Query Pinecone with timeout
    const pineconePromise = index.query({
      vector: embedding,
      topK,
      includeMetadata: true,
    });

    const result = (await Promise.race([
      pineconePromise,
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Pinecone timeout")), 5000)
      ),
    ])) as PineconeQueryResult;

    // Step 3: Return context chunks
    const contexts =
      result.matches?.map((match: PineconeMatch) => match.metadata?.text) ?? [];

    return contexts;
  } catch (error) {
    console.warn("Context retrieval failed:", error);
    // Return empty array to continue without context
    return [];
  }
}
