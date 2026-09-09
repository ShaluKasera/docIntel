# pyrefly: ignore [missing-import]
from sqlalchemy.orm import Session

from app.repositories.document_repository import DocumentRepository
from app.services.embedding_service import get_embedding_service


class SearchService:

    @staticmethod
    def search(
        query: str,
        document_id: str,
        db: Session,
        limit: int = 5
    ):

        embedding_service = get_embedding_service()

        query_embedding = (
            embedding_service.generate_embedding(
                query
            )
        )

        repository = DocumentRepository(db)

        chunks = repository.search_similar_chunks(
            query_embedding=query_embedding,
            document_id=document_id,
            limit=limit
        )

        results = [
            {
                "chunk_id": chunk.id,
                "document_id": str(chunk.document_id),
                "page_number": chunk.page_number,
                "content": chunk.content,
                "score": 1 - distance
            }
            for chunk, distance in chunks
        ]

        return results