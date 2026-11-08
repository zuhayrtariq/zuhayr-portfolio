import { openai } from "@ai-sdk/openai";
import { Pinecone } from "@pinecone-database/pinecone";
import { embed } from "ai";

let index: ReturnType<Pinecone["index"]> | null = null;

const getIndex = () => {
  if (!process.env.PINECONE_API_KEY || !process.env.PINECONE_INDEX) return null;
  index ??= new Pinecone({ apiKey: process.env.PINECONE_API_KEY }).index(process.env.PINECONE_INDEX);
  return index;
};

/**
 * Returns CV and portfolio notes from Pinecone that relate to the question.
 * The index was built with text-embedding-3-small, so queries must use it too.
 * Never throws: retrieval is a bonus on top of the built-in profile.
 */
export async function retrieveNotes(question: string, topK = 4): Promise<string[]> {
  const pinecone = getIndex();
  if (!pinecone || !process.env.OPENAI_API_KEY || question.trim().length < 3) return [];

  try {
    const { embedding } = await embed({
      model: openai.embedding("text-embedding-3-small"),
      value: question,
      abortSignal: AbortSignal.timeout(3000),
    });
    const result = await pinecone.query({ vector: embedding, topK, includeMetadata: true });
    return (result.matches ?? [])
      .map((m) => (typeof m.metadata?.text === "string" ? m.metadata.text : ""))
      .filter(Boolean);
  } catch (error) {
    console.warn("Note retrieval failed", error);
    return [];
  }
}
