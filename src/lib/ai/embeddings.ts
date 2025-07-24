import { Pinecone } from "@pinecone-database/pinecone";

const pc = new Pinecone({
	// biome-ignore lint: Forbidden non-null assertion.
	apiKey: process.env.PINECONE_API_KEY!,
});
