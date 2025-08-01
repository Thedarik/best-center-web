from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from contextlib import asynccontextmanager
import uvicorn
from datetime import datetime
import logging

from database import engine, Base
from routers import listening_tests, reading_tests, writing_tests, auth, users
from models import create_tables

# Logging setup
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    logger.info("🚀 Starting IELTS Test API...")
    create_tables()
    logger.info("✅ Database tables created")
    yield
    # Shutdown
    logger.info("🛑 Shutting down IELTS Test API...")

app = FastAPI(
    title="IELTS Test Management API",
    description="IELTS Listening, Reading, and Writing test management system",
    version="1.0.0",
    lifespan=lifespan
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router, prefix="/api", tags=["Authentication"])
app.include_router(users.router, prefix="/api", tags=["Users"])
app.include_router(listening_tests.router, prefix="/api", tags=["Listening Tests"])
app.include_router(reading_tests.router, prefix="/api", tags=["Reading Tests"])
app.include_router(writing_tests.router, prefix="/api", tags=["Writing Tests"])

@app.get("/")
async def root():
    return {
        "message": "IELTS Test Management API",
        "version": "1.0.0",
        "status": "running",
        "timestamp": datetime.now().isoformat()
    }

@app.get("/api/health")
async def health_check():
    return {
        "status": "healthy",
        "message": "IELTS Test API is running",
        "timestamp": datetime.now().isoformat(),
        "version": "1.0.0"
    }

@app.get("/api/debug")
async def debug_info():
    return {
        "api_version": "1.0.0",
        "database": "SQLite",
        "endpoints": {
            "listening_tests": "/api/listening-tests",
            "reading_tests": "/api/reading-tests", 
            "writing_tests": "/api/writing-tests",
            "auth": "/api/auth",
            "users": "/api/users"
        },
        "timestamp": datetime.now().isoformat()
    }

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    ) 