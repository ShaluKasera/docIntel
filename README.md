# DocIntel — Setup & Usage Guide

DocIntel is an AI-powered PDF question-answering application built using Retrieval-Augmented Generation (RAG).

This guide explains how to set up and run DocIntel.

---

## Prerequisites

Install the following software before starting:

- Python 3.11+
- Node.js 18+
- Docker Desktop
- Ollama
- Git

Verify the installations using PowerShell or Terminal:

```powershell
python --version
node --version
npm --version
docker --version
docker compose version
ollama --version
git --version
```

---

## Setup & Running Instructions

### 1. Clone Project

Clone the repository and navigate into the project directory:

```bash
git clone https://github.com/ShaluKasera/docIntel.git
cd docIntel
```

### 2. Docker / PostgreSQL

Start the PostgreSQL database with pgvector support using Docker Compose:

```bash
docker compose up -d
```

Check that the PostgreSQL container is running:

```bash
docker ps
```

The project uses PostgreSQL with the pgvector extension for storing and searching document embeddings.

### 3. Ollama (LLM)

Download the required local LLM model:

```bash
ollama pull llama3.2:3b
```

Verify that the model is installed:

```bash
ollama list
```

DocIntel uses Ollama to run the LLM locally without requiring a paid external LLM API.

### 4. Backend Setup

Open a terminal and navigate to the backend folder:

```bash
cd backend
```
### Backend Environment

Create:

`backend/.env`

Add:

```env
FRONTEND_URL=http://localhost:3000
DATABASE_URL=postgresql://docintel:docintel_password@localhost:5432/docintel
```

Create a Python virtual environment:

```bash
python -m venv venv
```

Activate the virtual environment on Windows:

```bash
venv\Scripts\activate
```

For Linux/macOS:

```bash
source venv/bin/activate
```

Install the backend dependencies:

```bash
pip install -r requirements.txt
```

Start the FastAPI backend:

```bash
uvicorn app.main:app --reload
```

The backend will be available at: `http://127.0.0.1:8000`

FastAPI API documentation is available at: `http://127.0.0.1:8000/docs`

### 5. Frontend Setup

Open a new terminal and navigate to the frontend folder:

```bash
cd frontend
```

Install the frontend dependencies:

```bash
npm install
```

### Frontend Environment

Create:

`frontend/.env.local`

Add:

```env
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000
```

---

Start the Next.js development server:

```bash
npm run dev
```

The frontend will be available at: `http://localhost:3000`

---



## Application Usage

Once both the backend and frontend are running:

1. Open `http://localhost:3000` in a browser.
2. Upload a PDF document.
3. Wait for the document processing to complete.
4. Select the processed document.
5. Enter a question about the document.
6. Submit the question.
7. DocIntel retrieves relevant document chunks using semantic similarity.
8. The retrieved context is provided to the local LLM.
9. The application displays the generated answer along with relevant sources.

---

## API Endpoints

The main backend endpoints are:

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `GET` | `/` | Backend health check |
| `GET` | `/api/v1/health/database` | Database connectivity check |
| `POST` | `/api/v1/documents/upload` | Upload and process a PDF |
| `GET` | `/api/v1/documents` | Retrieve uploaded documents |
| `POST` | `/api/v1/documents/ask` | Ask a question about a document |
| `POST` | `/api/v1/documents/search` | Perform semantic document search |
| `DELETE` | `/api/v1/documents/{document_id}` | Delete a document |

Interactive API documentation is available through FastAPI Swagger UI: `http://127.0.0.1:8000/docs`

---

## Testing

DocIntel includes both unit and integration tests.

### Unit Tests

Run:

```bash
python -m pytest tests/test_unit_cases.py -v
```

Current result: **11 passed**

Unit tests cover:
- Chunking configuration validation
- Empty-page handling
- Page-number preservation
- Long-text chunking
- Sequential chunk IDs
- PDF text extraction
- Request validation
- QA behavior when no sources are retrieved
- Passing retrieved context to the LLM

The recorded test output is available in: `backend/tests/unit_test_results.txt`

### Integration Tests

Run:

```bash
python -m pytest tests/test_docintel.py -v
```

Current result: **7 passed**

Integration tests cover:
- Backend health
- Database health
- Document listing
- PDF upload and processing
- End-to-end document question answering
- Invalid file rejection
- Empty-question validation

The recorded test output is available in: `backend/tests/integration_test_results.txt`

### Overall Test Result

```text
Unit Tests:         11 passed
Integration Tests:   7 passed
--------------------------------
Total:              18 passed
```

---

## Project Structure

```text
docIntel/
│
├── backend/
│   ├── app/
│   ├── tests/
│   ├── requirements.txt
│   └── .env
│
├── frontend/
│   ├── app/
│   ├── components/
│   ├── services/
│   ├── types/
│   ├── lib/
│   └── .env.local
│
├── docker-compose.yml
└── README.md
```

`.env`, `.env.local`, `venv`, `node_modules`, and generated build/cache files should not be committed to the repository.

---

## Troubleshooting

### PostgreSQL is not running

Check the Docker containers:

```bash
docker ps
```

If the PostgreSQL container is not running, start it with:

```bash
docker compose up -d
```

### Ollama model is not available

Check installed models:

```bash
ollama list
```

If `llama3.2:3b` is missing:

```bash
ollama pull llama3.2:3b
```

### Backend cannot connect to PostgreSQL

Verify that:
- Docker Desktop is running.
- The PostgreSQL container is running.
- PostgreSQL is exposed on port 5432.
- `backend/.env` contains the correct `DATABASE_URL`.

### Frontend cannot connect to backend

Verify that:
- The FastAPI server is running.
- The backend is available at `http://127.0.0.1:8000`.
- `frontend/.env.local` contains `NEXT_PUBLIC_API_URL=http://127.0.0.1:8000`.
- Restart the Next.js development server after modifying `.env.local`.

### Python virtual environment is not active

On Windows:

```bash
venv\Scripts\activate
```

You should see `(venv)` at the beginning of the terminal prompt.

---

## Limitations

The current version of DocIntel is intended as a local prototype and evaluation project.

Current limitations include:
- PDF ingestion is currently focused on text-based PDFs.
- Scanned/image-only PDFs require OCR support.
- LLM inference runs locally and therefore depends on available CPU and memory.
- The application does not currently implement user authentication.
- Document storage is local to the configured PostgreSQL instance.
- Large documents may require optimization of chunking and retrieval parameters.
- Production deployment would require additional security, observability, and infrastructure configuration.

---

## Future Scope

Potential improvements include:
- OCR support for scanned documents
- Multi-document question answering
- Improved chunking strategies
- Reranking of retrieved chunks
- Streaming LLM responses
- Authentication and user-specific document access
- Background document processing
- Document versioning
- Evaluation metrics for retrieval and answer quality
- Production deployment with monitoring and logging

---

## Conclusion

DocIntel demonstrates an end-to-end Retrieval-Augmented Generation workflow for document question answering.

The application combines PDF processing, text chunking, local embeddings, PostgreSQL with pgvector, semantic retrieval, and a local LLM to generate answers grounded in uploaded document content.

The project also includes automated unit and integration tests to validate core functionality and API behavior.
