from fastapi import APIRouter

from app.services.database_service import DatabaseService


router = APIRouter(
    prefix="/api/v1/health",
    tags=["Health"]
)


@router.get("/database")
async def database_health():

    is_connected = DatabaseService.test_connection()

    return {
        "database": "postgresql",
        "connected": is_connected
    }