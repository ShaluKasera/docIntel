from app.schemas.document_schema import (
    PageContent,
    DocumentChunk,
)


class ChunkingService:

    def __init__(
        self,
        chunk_size: int = 1000,
        chunk_overlap: int = 200
    ):
        if chunk_overlap >= chunk_size:
            raise ValueError(
                "chunk_overlap must be smaller than chunk_size"
            )

        self.chunk_size = chunk_size
        self.chunk_overlap = chunk_overlap

    def create_chunks(
        self,
        pages: list[PageContent]
    ) -> list[DocumentChunk]:

        chunks = []
        chunk_id = 1

        for page in pages:

            text = page.text.strip()

            if not text:
                continue

            start = 0

            while start < len(text):

                end = start + self.chunk_size

                chunk_text = text[start:end].strip()

                if chunk_text:
                    chunks.append(
                        DocumentChunk(
                            chunk_id=chunk_id,
                            page=page.page,
                            text=chunk_text
                        )
                    )

                    chunk_id += 1

                start += (
                    self.chunk_size
                    - self.chunk_overlap
                )

        return chunks