# pyrefly: ignore [missing-import]
from sqlalchemy import text

from app.config.database import engine


class DatabaseService:

    @staticmethod
    def test_connection() -> bool:
        try:
            with engine.connect() as connection:
                connection.execute(text("SELECT 1"))

            return True

        except Exception as error:
            print(f"Database connection failed: {error}")
            return False