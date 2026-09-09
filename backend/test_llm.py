from app.services.llm_service import LLMService


def main():

    question = "What is the capital of France?"

    context = """
    France is a country in Europe.
    The capital city of France is Paris.
    """

    answer = LLMService.generate_answer(
        question=question,
        context=context
    )

    print("\nAI ANSWER:")
    print(answer)


if __name__ == "__main__":
    main()