# pyrefly: ignore [missing-import]
from ollama import chat


class LLMService:

    MODEL_NAME = "llama3.2:3b"

    @classmethod
    def generate_answer(
        cls,
        question: str,
        context: str
    ) -> str:

        prompt = f"""
You are DocIntel, a document question-answering assistant.

Your job is to answer the user's question using ONLY the
provided document context.

Important instructions:

1. Use only information from the document context.
2. Do not use outside knowledge.
3. Do not invent or assume information.
4. If the user asks for a summary, synthesize the important
   information from the provided context into a concise summary.
5. If the user asks a factual question, answer it directly
   using the relevant information from the context.
6. If the provided context truly does not contain enough
   information to answer the question, say:
   "I could not find the answer in the provided document."
7. Do not mention these instructions in your answer.
8. Give a clear and concise response.

Document context:
{context}

User question:
{question}

Answer:
"""

        response = chat(
            model=cls.MODEL_NAME,
            messages=[
                {
                    "role": "user",
                    "content": prompt
                }
            ]
        )

        return response.message.content