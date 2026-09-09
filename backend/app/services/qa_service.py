# pyrefly: ignore [missing-import]
from sqlalchemy.orm import Session

from app.services.search_service import SearchService
from app.services.llm_service import LLMService


class QAService:

    @staticmethod
    def ask(
        question: str,
        document_id: str,
        db: Session,
        limit: int = 5
    ):

        # 1. Retrieve relevant chunks

        sources = SearchService.search(
            query=question,
            document_id=document_id,
            db=db,
            limit=limit
        )

        # 2. Build context

        context_parts = []

        for source in sources:

            context_parts.append(
                f"""
Page {source["page_number"]}:

{source["content"]}
"""
            )

        context = "\n".join(context_parts)

        # If no relevant document chunks were found,
        # do not call the LLM with empty context.
        if not sources:
            return {
                "answer": "I could not find relevant information in the provided document.",
                "sources": []
            }

        # 3. Generate answer

        answer = LLMService.generate_answer(
            question=question,
            context=context
        )

        # 4. Return answer + sources

        return {
            "answer": answer,
            "sources": sources
        }