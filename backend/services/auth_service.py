from datetime import datetime, timedelta
from typing import Optional
from jose import JWTError, jwt
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from backend.database import get_db
from backend.models import User
from backend.config import get_settings

settings = get_settings()
security = HTTPBearer(auto_error=False)

ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_DAYS = 30

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(days=ACCESS_TOKEN_EXPIRE_DAYS))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, settings.secret_key, algorithm=ALGORITHM)

def decode_token(token: str) -> dict:
    try:
        payload = jwt.decode(token, settings.secret_key, algorithms=[ALGORITHM])
        return payload
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token"
        )

async def get_current_user(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(security),
    db: Session = Depends(get_db)
) -> Optional[User]:
    if not credentials:
        return None
    
    payload = decode_token(credentials.credentials)
    user_id = payload.get("sub")
    
    if not user_id:
        raise HTTPException(status_code=401, detail="Invalid token")
    
    user = db.query(User).filter(User.id == int(user_id)).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    return user

async def require_auth(
    current_user: Optional[User] = Depends(get_current_user)
) -> User:
    if not current_user:
        raise HTTPException(status_code=401, detail="Authentication required")
    return current_user

async def require_subscription(
    tiers: list[str],
    current_user: User = Depends(require_auth)
) -> User:
    if current_user.subscription_tier not in tiers:
        raise HTTPException(
            status_code=403,
            detail=f"Subscription tier {tiers} required"
        )
    return current_user
