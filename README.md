# How to start this app

1. Start ChromaDB
   docker run -p 8000:8000 chromadb/chroma
2. Index the document
   node server/ingest.js
3. Start backend
   node server/index.js
4. Open UI by opening the file directly or by run the live-server
