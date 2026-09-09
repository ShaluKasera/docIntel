from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config.settings import settings
from app.config.init_db import initialize_database

from app.routers.document_router import router as document_router
from app.routers.health_router import router as health_router



app = FastAPI(
    title="DocIntel API",
    description="AI-powered document question answering system",
    version="1.0.0",
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.FRONTEND_URL],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

initialize_database()


app.include_router(document_router)
app.include_router(health_router)


@app.get("/")
async def health_check():
    return {
        "message": "DocIntel API is running."
    }