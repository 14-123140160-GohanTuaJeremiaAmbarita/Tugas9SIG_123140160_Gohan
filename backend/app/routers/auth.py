from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from passlib.context import CryptContext
from ..database import get_pool
from ..utils.auth import create_token

router = APIRouter(prefix="/api/auth", tags=["auth"])
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

@router.post("/login")
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    pool = await get_pool()
    async with pool.acquire() as conn:
        # PERBAIKAN: Menggunakan kolom 'username' sesuai struktur database kamu
        user = await conn.fetchrow("SELECT * FROM users WHERE username = $1", form_data.username)
        
        if not user or not pwd_context.verify(form_data.password, user["password_hash"]):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Username atau password salah."
            )
            
        # PERBAIKAN: Menggunakan user["username"] sebagai payload token JWT
        token = create_token({"sub": user["username"]})
        return {"access_token": token, "token_type": "bearer"}