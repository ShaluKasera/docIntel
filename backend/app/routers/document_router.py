
from fastapi import APIRouter, Depends, File, UploadFile
# pyrefly: ignore [missing-import]
from sqlalchemy.orm import Session

from app.config.database_dependency import get_db
from app.controllers.document_controller import (
    DocumentController
)
from app.schemas.document_schema import (
    DocumentProcessResponse,
    DocumentSearchRequest,
    DocumentSearchResponse,
    DocumentAskRequest,
    DocumentAskResponse,
    DocumentListResponse
)


router = APIRouter(
    prefix="/api/v1/documents",
    tags=["Documents"]
)


@router.post(
    "/upload",
    response_model=DocumentProcessResponse
)
async def upload_document(
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):

    return await DocumentController.upload_document(
        file=file,
        db=db
    )


@router.post("/search", response_model=DocumentSearchResponse)
async def search_documents(
    request: DocumentSearchRequest,
    db: Session = Depends(get_db)
):
    result = await DocumentController.search_documents(
        request=request,
        db=db
    )

    return {
        "query": request.query,
        "results": result
    }

@router.post(
    "/ask",
    response_model=DocumentAskResponse
)
async def ask_question(
    request: DocumentAskRequest,
    db: Session = Depends(get_db)
):
    result = await DocumentController.ask_question(
        request=request,
        db=db
    )

    return {
        "question": request.question,
        "answer": result["answer"],
        "sources": result["sources"]
    }


@router.get(
    "",
    response_model=DocumentListResponse
)
async def get_documents(
    db: Session = Depends(get_db)
):
    documents = DocumentController.get_documents(db)

    return {
        "documents": documents
    }

@router.delete("/{document_id}")
async def delete_document(
    document_id: str,
    db: Session = Depends(get_db)
):
    return DocumentController.delete_document(
        document_id=document_id,
        db=db
    )