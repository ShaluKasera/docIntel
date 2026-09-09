from pydantic import BaseModel, Field


class PageContent(BaseModel):
    page: int = Field(..., ge=1)
    text: str


class DocumentUploadResponse(BaseModel):
    filename: str
    total_pages: int
    pages: list[PageContent]


class DocumentChunk(BaseModel):
    chunk_id: int
    page: int
    text: str


class DocumentProcessResponse(BaseModel):
    document_id: str
    filename: str
    total_pages: int
    total_chunks: int
    status: str


class DocumentSearchRequest(BaseModel):
    query: str = Field(..., min_length=1)
    limit: int = Field(default=5, ge=1, le=20)


class DocumentSearchResult(BaseModel):
    chunk_id: int
    document_id: str
    page_number: int
    content: str
    score: float


class DocumentSearchResponse(BaseModel):
    query: str
    results: list[DocumentSearchResult]
    

class DocumentAskRequest(BaseModel):
    document_id: str
    question: str = Field(..., min_length=1)
    limit: int = Field(default=5, ge=1, le=20)


class DocumentSource(BaseModel):
    chunk_id: int
    document_id: str
    page_number: int
    content: str
    score: float


class DocumentAskResponse(BaseModel):
    question: str
    answer: str
    sources: list[DocumentSource]


class DocumentListItem(BaseModel):
    id: str
    filename: str
    file_size: int
    total_pages: int
    status: str
    created_at: str

class DocumentListResponse(BaseModel):
    documents: list[DocumentListItem]