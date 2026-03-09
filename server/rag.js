import dotenv from "dotenv";
import { ChromaClient } from "chromadb";

dotenv.config();

const client = new ChromaClient({
  host: "localhost",
  port: 8000,
});

const collection = await client.getOrCreateCollection({
  name: "rag_collection",
});

async function getEmbedding(text) {
  const res = await fetch("https://api.openai.com/v1/embeddings", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: "text-embedding-3-small",
      input: text,
    }),
  });

  const data = await res.json();

  return data.data[0].embedding;
}

async function searchChunks(query) {
  const embedding = await getEmbedding(query);

  const results = await collection.query({
    queryEmbeddings: [embedding],
    nResults: 3,
    include: ["metadatas"],
  });

  return results.metadatas[0].map((m) => m.text);
}

async function askLLM(question, chunks) {
  const context = chunks.join("\n\n");

  const prompt = `
Use the context below to answer.

${context}

Question: ${question}
`;

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "Answer only using the context" },
        { role: "user", content: prompt },
      ],
    }),
  });

  const data = await res.json();

  return data.choices[0].message.content;
}

export async function askRag(question) {
  const chunks = await searchChunks(question);

  const answer = await askLLM(question, chunks);

  return answer;
}
