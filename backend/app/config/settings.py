import os

from dotenv import load_dotenv


load_dotenv()


class Settings:

    FRONTEND_URL: str = os.getenv(
        "FRONTEND_URL",
        "http://localhost:3000"
    )

    DATABASE_URL: str = os.getenv(
        "DATABASE_URL"
    )


settings = Settings()