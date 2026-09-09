from fastapi import UploadFile, HTTPException
# pyrefly: ignore [missing-import]
from sqlalchemy.orm import Session

from app.services.document_service import DocumentService
from app.schemas.document_schema import DocumentSearchRequest
from app.services.search_service import SearchService
from app.schemas.document_schema import DocumentAskRequest
from app.services.qa_service import QAService

class DocumentController:

    @staticmethod
    async def upload_document(
        file: UploadFile,
        db: Session
    ):
        if file.content_type != "application/pdf":
            raise HTTPException(
                status_code=400,
                detail="Only PDF files are allowed."
            )

        file_bytes = await file.read()

        if not file_bytes:
            raise HTTPException(
                status_code=400,
                detail="Uploaded PDF is empty."
            )

        return await DocumentService.process_document(
            file_bytes=file_bytes,
            filename=file.filename,
            db=db
        )

    @staticmethod
    async def search_documents(
        request: DocumentSearchRequest,
        db: Session
    ):
        return SearchService.search(
            query=request.query,
            db=db,
            limit=request.limit
        )
    

    @staticmethod
    async def ask_question(
        request: DocumentAskRequest,
        db: Session
    ):
        return QAService.ask(
            question=request.question,
            document_id=request.document_id,
            db=db,
            limit=request.limit
        )

    @staticmethod
    def get_documents(db: Session):
        documents = DocumentService.get_documents(db)

        return [
            {
                "id": str(document.id),
                "filename": document.filename,
                "file_size": document.file_size,
                "total_pages": document.total_pages,
                "status": document.status,
                "created_at": document.created_at.isoformat(),
            }
            for document in documents
        ]


    @staticmethod
    def delete_document(document_id: str, db: Session):
        try:
            DocumentService.delete_document(
                document_id=document_id,
                db=db
            )

            return {
                "message": "Document deleted successfully.",
                "document_id": document_id
            }

        except ValueError as error:
            raise HTTPException(
            status_code=404,
            detail=str(error)
        )