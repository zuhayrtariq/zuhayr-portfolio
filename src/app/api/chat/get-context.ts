import { OpenAI } from "openai";
import { Pinecone } from "@pinecone-database/pinecone";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

const pinecone = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY!,
});

const index = pinecone.index(process.env.PINECONE_INDEX!);

export async function getRelevantChunks(query: string, topK: number = 5) {
  // Step 1: Embed the query
  const queryEmbedding = await openai.embeddings.create({
    model: "text-embedding-3-small",
    input: query,
  });

  const embedding = queryEmbedding.data[0].embedding;

  //   console.log("embeddings", embedding);

  // Step 2: Query Pinecone
  const result = await index.query({
    vector: embedding,
    topK,
    includeMetadata: true,
  });

  // Step 3: Return context chunks
  const contexts = result.matches?.map((match) => match.metadata?.text) ?? [];

  return contexts;
}
