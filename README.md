# How to start this app

1. Start ChromaDB

   ```bash
   docker run -p 8000:8000 chromadb/chroma
   ```

2. Index the document

   ```bash
   node server/ingest.js
   ```

3. Start backend

   ```bash
   node server/index.js
   ```

4. Open UI by opening the file directly or by run the live-server
