from functools import lru_cache

# pyrefly: ignore [missing-import]
from sentence_transformers import SentenceTransformer


class EmbeddingService:

    MODEL_NAME = "BAAI/bge-small-en-v1.5"

    def __init__(self):
        self.model = SentenceTransformer(
            self.MODEL_NAME
        )

    def generate_embedding(
        self,
        text: str
    ) -> list[float]:

        embedding = self.model.encode(
            text,
            normalize_embeddings=True
        )

        return embedding.tolist()

    def generate_embeddings(
        self,
        texts: list[str]
    ) -> list[list[float]]:

        embeddings = self.model.encode(
            texts,
            normalize_embeddings=True
        )

        return embeddings.tolist()


@lru_cache(maxsize=1)
def get_embedding_service() -> EmbeddingService:
    return EmbeddingService()