from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from passlib.context import CryptContext

# Pastikan relative import database & utils ini mengarah ke tingkat yang benar
from ..database import get_pool
from ..utils.auth import create_token

# DEKLARASI ROUTER UTAMA (Ini yang dicari oleh main.py agar tidak AttributeError)
router = APIRouter(prefix="/api/auth", tags=["auth"])

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

@router.post("/login")
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    pool = await get_pool()
    async with pool.acquire() as conn:
        # Mencari user berdasarkan email (username form OAuth2)
        user = await conn.fetchrow("SELECT * FROM users WHERE email = $1", form_data.username)
        
        # Validasi kecocokan user dan password hash
        if not user or not pwd_context.verify(form_data.password, user["password_hash"]):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Email atau password salah."
            )
            
        # Membuat Token Akses JWT jika kredensial benar
        token = create_token({"sub": user["email"]})
        return {"access_token": token, "token_type": "bearer"}