import io
from unittest.mock import Mock

# pyrefly: ignore [missing-import]
import pytest
# pyrefly: ignore [missing-import]
import pymupdf
from pydantic import ValidationError

from app.services.chunking_service import ChunkingService
from app.schemas.document_schema import (
    PageContent,
    DocumentSearchRequest,
    DocumentAskRequest,
)
from app.services.qa_service import QAService


def test_chunking_rejects_invalid_overlap():
    """Chunk overlap must be smaller than chunk size."""
    with pytest.raises(ValueError):
        ChunkingService(chunk_size=100, chunk_overlap=100)


def test_chunking_skips_empty_pages():
    """Empty PDF pages should not create chunks."""
    service = ChunkingService(chunk_size=100, chunk_overlap=20)

    pages = [
        PageContent(page=1, text=""),
        PageContent(page=2, text="Useful document content."),
    ]

    chunks = service.create_chunks(pages)

    assert len(chunks) == 1
    assert chunks[0].page == 2


def test_chunking_preserves_page_number():
    """Each chunk should retain the page number of its source page."""
    service = ChunkingService(chunk_size=50, chunk_overlap=10)

    pages = [
        PageContent(page=3, text="This is content from page three.")
    ]

    chunks = service.create_chunks(pages)

    assert chunks
    assert all(chunk.page == 3 for chunk in chunks)


def test_chunking_creates_multiple_chunks_for_long_text():
    """Long text should be split into multiple chunks."""
    service = ChunkingService(chunk_size=50, chunk_overlap=10)

    pages = [
        PageContent(page=1, text="A" * 120)
    ]

    chunks = service.create_chunks(pages)

    assert len(chunks) > 1
    assert all(len(chunk.text) <= 50 for chunk in chunks)


def test_chunking_creates_sequential_chunk_ids():
    """Generated chunk IDs should start at 1 and increase sequentially."""
    service = ChunkingService(chunk_size=40, chunk_overlap=10)

    pages = [
        PageContent(page=1, text="A" * 100)
    ]

    chunks = service.create_chunks(pages)

    assert [chunk.chunk_id for chunk in chunks] == list(
        range(1, len(chunks) + 1)
    )


@pytest.mark.asyncio
async def test_pdf_extraction_extracts_text():
    """PyMuPDF service should extract text from a PDF page."""
    from app.services.pdf_service import PDFService

    document = pymupdf.open()
    page = document.new_page()
    page.insert_text((72, 72), "DocIntel unit test document.")
    pdf_bytes = document.tobytes()
    document.close()

    pages = await PDFService.extract_text(pdf_bytes)

    assert len(pages) == 1
    assert pages[0]["page"] == 1
    assert "DocIntel unit test document." in pages[0]["text"]


def test_search_request_rejects_empty_query():
    """Semantic search should reject an empty query."""
    with pytest.raises(ValidationError):
        DocumentSearchRequest(query="")


def test_search_request_rejects_invalid_limit():
    """Search limit must remain within the API validation range."""
    with pytest.raises(ValidationError):
        DocumentSearchRequest(query="architecture", limit=0)


def test_ask_request_rejects_empty_question():
    """Document question requests should reject empty questions."""
    with pytest.raises(ValidationError):
        DocumentAskRequest(
            document_id="test-document-id",
            question="",
        )


def test_qa_returns_guard_message_when_no_sources(monkeypatch):
    """QA service should not call the LLM when retrieval returns no sources."""
    search_mock = Mock(return_value=[])
    llm_mock = Mock()

    monkeypatch.setattr(
        "app.services.qa_service.SearchService.search",
        search_mock,
    )
    monkeypatch.setattr(
        "app.services.qa_service.LLMService.generate_answer",
        llm_mock,
    )

    result = QAService.ask(
        question="What is the purpose?",
        document_id="test-document-id",
        db=Mock(),
        limit=5,
    )

    assert result["sources"] == []
    assert result["answer"] == (
        "I could not find relevant information in the provided document."
    )
    search_mock.assert_called_once()
    llm_mock.assert_not_called()


def test_qa_passes_retrieved_context_to_llm(monkeypatch):
    """QA service should build context from retrieved chunks and pass it to the LLM."""
    sources = [
        {
            "chunk_id": 1,
            "document_id": "doc-1",
            "page_number": 2,
            "content": "The system uses semantic vector search.",
            "score": 0.92,
        },
        {
            "chunk_id": 2,
            "document_id": "doc-1",
            "page_number": 4,
            "content": "The system generates answers using retrieved context.",
            "score": 0.88,
        },
    ]

    search_mock = Mock(return_value=sources)
    llm_mock = Mock(return_value="The system uses RAG to answer questions.")

    monkeypatch.setattr(
        "app.services.qa_service.SearchService.search",
        search_mock,
    )
    monkeypatch.setattr(
        "app.services.qa_service.LLMService.generate_answer",
        llm_mock,
    )

    result = QAService.ask(
        question="How does the system answer questions?",
        document_id="doc-1",
        db=Mock(),
        limit=5,
    )

    assert result["answer"] == "The system uses RAG to answer questions."
    assert result["sources"] == sources

    llm_mock.assert_called_once()
    call_kwargs = llm_mock.call_args.kwargs

    assert call_kwargs["question"] == "How does the system answer questions?"
    assert "Page 2:" in call_kwargs["context"]
    assert "semantic vector search" in call_kwargs["context"]
    assert "Page 4:" in call_kwargs["context"]
    assert "retrieved context" in call_kwargs["context"]
