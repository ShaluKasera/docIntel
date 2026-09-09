# pyrefly: ignore [missing-import]
from sentence_transformers import SentenceTransformer


def main():

    model = SentenceTransformer(
        "BAAI/bge-small-en-v1.5"
    )

    sentences = [
        "The company generated revenue of 50 million dollars.",
        "The organization made 50 million dollars in revenue.",
        "The weather is sunny today."
    ]

    embeddings = model.encode(
        sentences,
        normalize_embeddings=True
    )

    similarities = model.similarity(
        embeddings,
        embeddings
    )

    print(similarities)


if __name__ == "__main__":
    main()