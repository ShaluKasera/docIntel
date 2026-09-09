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

```bash
git clone https://github.com/ShaluKasera/docIntel.git
cd docintel
```

### 2. Docker / PostgreSQL

Start the PostgreSQL database with pgvector support using Docker Compose:

```bash
docker compose up -d

# Check running container
docker ps
```

### 3. Ollama (LLM)

Download and list the required LLM model:

```bash
# Download the LLM
ollama pull llama3.2:3b

# Check installed model
ollama list
```

### 4. Backend Setup

In your terminal, navigate to the backend folder, create and activate a virtual environment, install the dependencies, and start the FastAPI server:

```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment (Windows)
venv\Scripts\activate
# On Linux/macOS: source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Start backend server
uvicorn app.main:app --reload
```

### 5. Frontend Setup

Open a **NEW terminal**, navigate to the frontend folder, install dependencies, and start the frontend development server:

```bash
cd frontend

# Install dependencies
npm install

# Start frontend
npm run dev
```


