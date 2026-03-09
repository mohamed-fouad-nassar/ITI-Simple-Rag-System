import dotenv from "dotenv";
import fs from "fs/promises";
import { ChromaClient } from "chromadb";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";

dotenv.config();

import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const filePath = path.join(__dirname, "../document.txt");

const text = await fs.readFile(filePath, "utf-8");

const splitter = new RecursiveCharacterTextSplitter({
  chunkSize: 300,
  chunkOverlap: 50,
});

const chunks = await splitter.splitText(text);

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

const client = new ChromaClient({
  host: "localhost",
  port: 8000,
});

const collection = await client.getOrCreateCollection({
  name: "rag_collection",
  embeddingFunction: null,
});

for (let i = 0; i < chunks.length; i++) {
  const embedding = await getEmbedding(chunks[i]);

  await collection.add({
    ids: [`chunk-${i}`],
    embeddings: [embedding],
    metadatas: [{ text: chunks[i] }],
  });

  console.log("stored chunk", i);
}

console.log("Document indexed");
