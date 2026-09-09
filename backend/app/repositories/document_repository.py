import uuid

# pyrefly: ignore [missing-import]
from sqlalchemy.orm import Session

# pyrefly: ignore [missing-import]
from app.models.document import Document
# pyrefly: ignore [missing-import]
from app.models.document_chunk import DocumentChunk


class DocumentRepository:

    def __init__(self, db: Session):
        self.db = db

    def create_document(
        self,
        filename: str,
        file_size: int,
        total_pages: int
    ) -> Document:

        document = Document(
            filename=filename,
            file_size=file_size,
            total_pages=total_pages,
            status="processed"
        )

        self.db.add(document)
        self.db.flush()

        return document

    def create_chunks(
        self,
        document_id: uuid.UUID,
        chunks: list[dict]
    ) -> list[DocumentChunk]:
        document_chunks = []

        for chunk in chunks:
            document_chunk = DocumentChunk(
            document_id=document_id,
            chunk_index=chunk["chunk_id"],
            page_number=chunk["page"],
            content=chunk["text"],
            embedding=chunk["embedding"]
        )

            self.db.add(document_chunk)
            document_chunks.append(document_chunk)

        self.db.flush()

        return document_chunks

    def commit(self) -> None:
        self.db.commit()

    def search_similar_chunks(
        self,
        query_embedding: list[float],
        document_id: uuid.UUID,
        limit: int = 5
    ) -> list[tuple[DocumentChunk, float]]:

        distance = DocumentChunk.embedding.cosine_distance(
            query_embedding
        )

        results = (
            self.db.query(
                DocumentChunk,
                distance.label("distance")
            )
            .filter(
                DocumentChunk.embedding.is_not(None),
                DocumentChunk.document_id == document_id
            )
            .order_by(distance)
            .limit(limit)
            .all()
        )

        return results

    def get_all_documents(self) -> list[Document]:
        return (
            self.db.query(Document)
            .order_by(Document.created_at.desc())
            .all()
        )

    def delete_document(self, document_id: uuid.UUID) -> bool:
        document = (
            self.db.query(Document)
            .filter(Document.id == document_id)
            .first()
        )

        if not document:
            return False

        self.db.delete(document)
        self.db.commit()

        return True