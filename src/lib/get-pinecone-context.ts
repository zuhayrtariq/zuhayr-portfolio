// lib/getPineconeContext.ts
import { OpenAI } from "openai";
import { Pinecone } from "@pinecone-database/pinecone";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });
const pinecone = new Pinecone({ apiKey: process.env.PINECONE_API_KEY! });
const index = pinecone.index(process.env.PINECONE_INDEX!);

export async function getPineconeContext(query: string): Promise<string> {
	try {
		console.log("🔍 Query:", query);

		// 1. Get embedding for user query
		const embeddingRes = await openai.embeddings.create({
			model: "text-embedding-3-small",
			input: query,
		});
		const vector = embeddingRes.data[0]?.embedding;

		if (!vector) throw new Error("No embedding returned from OpenAI");

		// 2. Query Pinecone
		const result = await index.query({
			vector,
			topK: 5,
			includeMetadata: true,
			includeValues: false, // no need to return raw embeddings
			// Optional filter example:
			// filter: { source: { $eq: "cv.pdf" } }
		});

		if (!result.matches || result.matches.length === 0) {
			console.warn("⚠️ No matches found in Pinecone.");
			return "";
		}

		// 4. Combine all matched chunks
		const contextText = result.matches
			.map((match) => match.metadata?.text || "")
			.filter((text) => text.trim() !== "")
			.join("\n---\n");

		return contextText;
	} catch (error) {
		console.error("❌ Error in getPineconeContext:", error);
		return "";
	}
}
