from api.api_v1.api import api_router as api_router_v1
from fastapi import FastAPI
from starlette.middleware.cors import CORSMiddleware

app = FastAPI(title="StyloCV API")

# This is insecure for production, but fine for local development.
# It allows the frontend (running on a different port) to make requests to the API.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

app.include_router(api_router_v1, prefix="/api/v1")
