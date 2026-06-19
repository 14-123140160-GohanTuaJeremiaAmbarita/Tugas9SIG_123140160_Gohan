from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database import get_pool, close_pool
from .routers import auth, fasilitas
from contextlib import asynccontextmanager

@asynccontextmanager
async def lifespan(app: FastAPI):
    await get_pool()
    yield
    await close_pool()

app = FastAPI(title="WebGIS API Fullstack", lifespan=lifespan)

origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(fasilitas.router)