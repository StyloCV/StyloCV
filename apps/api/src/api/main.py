import os

from api.api_v1.api import api_router as api_router_v1
from fastapi import FastAPI
from starlette.middleware.cors import CORSMiddleware

app = FastAPI(title="StyloCV API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=os.getenv("CORS_ORIGINS", "http://localhost:3000").split(","),
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

app.include_router(api_router_v1, prefix="/api/v1")
