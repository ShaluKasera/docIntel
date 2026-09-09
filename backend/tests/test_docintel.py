import requests

BASE_URL = "http://127.0.0.1:8000"
TEST_PDF = "tests/test_document.pdf"


def test_backend_health():
    response = requests.get(f"{BASE_URL}/")

    assert response.status_code == 200
    assert response.json()["message"] == "DocIntel API is running."


def test_database_health():
    response = requests.get(
        f"{BASE_URL}/api/v1/health/database"
    )

    assert response.status_code == 200
    assert response.json()["database"] == "postgresql"
    assert response.json()["connected"] is True


def test_document_list():
    response = requests.get(
        f"{BASE_URL}/api/v1/documents"
    )

    assert response.status_code == 200
    assert "documents" in response.json()


def test_document_upload():
    with open(TEST_PDF, "rb") as pdf_file:
        response = requests.post(
            f"{BASE_URL}/api/v1/documents/upload",
            files={
                "file": (
                    "test_document.pdf",
                    pdf_file,
                    "application/pdf"
                )
            }
        )

    assert response.status_code == 200

    data = response.json()

    assert "document_id" in data
    assert data["filename"] == "test_document.pdf"
    assert data["total_pages"] >= 1
    assert data["total_chunks"] >= 1
    assert data["status"] == "processed"


def test_document_ask():
    # Upload a real PDF through the API.
    with open(TEST_PDF, "rb") as pdf_file:
        upload_response = requests.post(
            f"{BASE_URL}/api/v1/documents/upload",
            files={
                "file": (
                    "test_document.pdf",
                    pdf_file,
                    "application/pdf"
                )
            }
        )

    assert upload_response.status_code == 200

    document_id = upload_response.json()["document_id"]

    # Ask a question about the uploaded document.
    response = requests.post(
        f"{BASE_URL}/api/v1/documents/ask",
        json={
            "document_id": document_id,
            "question": (
                "What does DocIntel use to retrieve "
                "relevant document content?"
            ),
            "limit": 5,
        },
    )

    assert response.status_code == 200

    data = response.json()

    assert data["question"] == (
        "What does DocIntel use to retrieve "
        "relevant document content?"
    )

    assert isinstance(data["answer"], str)
    assert len(data["answer"]) > 0

    assert "sources" in data
    assert isinstance(data["sources"], list)
    assert len(data["sources"]) > 0

def test_document_upload_rejects_non_pdf():
    response = requests.post(
        f"{BASE_URL}/api/v1/documents/upload",
        files={
            "file": (
                "invalid.txt",
                b"This is not a PDF.",
                "text/plain"
            )
        }
    )

    assert response.status_code in [400, 415]


def test_document_ask_rejects_empty_question():
    response = requests.post(
        f"{BASE_URL}/api/v1/documents/ask",
        json={
            "document_id": "00000000-0000-0000-0000-000000000000",
            "question": "",
            "limit": 5,
        },
    )

    assert response.status_code == 422