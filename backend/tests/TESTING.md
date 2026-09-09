# DocIntel Testing Report

## 1. Testing Objective

The DocIntel backend was tested to verify API availability, database connectivity,
document processing, retrieval-augmented question answering, and request validation.

Testing was performed using pytest against the locally running FastAPI application.

---

## 2. Test Environment

- Python: 3.14.3
- Test Framework: pytest 9.1.1
- Backend: FastAPI
- Database: PostgreSQL + pgvector
- Embedding Model: BAAI/bge-small-en-v1.5
- LLM: Ollama llama3.2:3b
- Operating System: Windows

---

## 3. Unit Tests

Test file:

`tests/test_unit_cases.py`

Command:

```text
python -m pytest tests/test_unit_cases.py -v