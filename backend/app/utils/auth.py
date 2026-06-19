from datetime import datetime, timedelta
from jose import jwt, JWTError
from fastapi import Depends, HTTPException

SECRET_KEY = "super-secret-key-itera-2026"
ALGORITHM = "HS256"

def create_token(data: dict, expires_minutes: int = 60):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=expires_minutes)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

async def get_current_user(token: str = Depends(jwt.get_current_user if hasattr(jwt, 'get_current_user') else lambda: None)):
    # Fallback function if standard OAuth2 scheme injected later
    pass