from fastapi import APIRouter

from .endpoints import render

api_router = APIRouter()
api_router.include_router(render.router, prefix="/render", tags=["render"])
