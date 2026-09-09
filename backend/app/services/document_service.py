# pyrefly: ignore [missing-import]
from sqlalchemy.orm import Session

from app.repositories.document_repository import DocumentRepository
from app.services.pdf_service import PDFService
from app.services.chunking_service import ChunkingService
from app.schemas.document_schema import PageContent
from app.services.embedding_service import get_embedding_service
from app.models.document import Document
from uuid import UUID

class DocumentService:

    @staticmethod
    async def process_document(
        file_bytes: bytes,
        filename: str,
        db: Session
    ):

        try:

            # 1. Extract PDF text

            extracted_pages = (
                await PDFService.extract_text(
                    file_bytes
                )
            )

            pages = [
                PageContent(**page)
                for page in extracted_pages
            ]

            if not pages:
                raise ValueError(
                    "No readable text found in PDF."
                )

            # 2. Create chunks

            chunking_service = ChunkingService()

            chunks = chunking_service.create_chunks(
                pages
            )

            if not chunks:
                raise ValueError("No chunks could be generated.")

            embedding_service = get_embedding_service()

            texts = [chunk.text for chunk in chunks]

            embeddings = embedding_service.generate_embeddings(texts)


            # 3. Save document

            repository = DocumentRepository(db)

            document = repository.create_document(
                filename=filename,
                file_size=len(file_bytes),
                total_pages=len(pages)
            )

            # 4. Save chunks

            chunk_data = [
                {
                    "chunk_id": chunk.chunk_id,
                    "page": chunk.page,
                    "text": chunk.text,
                    "embedding": embedding
                }
                for chunk, embedding in zip(chunks, embeddings)
            ]

            repository.create_chunks(
                document_id=document.id,
                chunks=chunk_data
            )

            # 5. Commit everything

            repository.commit()

            return {
                "document_id": str(document.id),
                "filename": document.filename,
                "total_pages": document.total_pages,
                "total_chunks": len(chunks),
                "status": document.status
            }

        except Exception:

            db.rollback()

            raise
    

    @staticmethod
    def get_documents(db: Session):
        repository = DocumentRepository(db)

        documents = repository.get_all_documents()

        return documents

    
    @staticmethod
    def delete_document(document_id: str, db: Session) -> bool:
        try:
            repository = DocumentRepository(db)

            deleted = repository.delete_document(
                UUID(document_id)
            )

            if not deleted:
                raise ValueError("Document not found.")

            return True

        except Exception:
            db.rollback()
            raise