from app.config.database import engine
# pyrefly: ignore [missing-import]
from app.models.base import Base
# pyrefly: ignore [missing-import]
from app.models.document import Document
# pyrefly: ignore [missing-import]
from app.models.document_chunk import DocumentChunk


def initialize_database() -> None:
    Base.metadata.create_all(
        bind=engine
    )