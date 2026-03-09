import express from "express";
import cors from "cors";
import { askRag } from "./rag.js";

const app = express();

app.use(cors());
app.use(express.json());

app.post("/ask", async (req, res) => {
  const { question } = req.body;

  const answer = await askRag(question);

  res.json({ answer });
});

app.listen(3000, () => console.log("Server running on 3000"));
