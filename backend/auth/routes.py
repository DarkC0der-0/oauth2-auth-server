from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from fastapi_limiter.depends import RateLimiter
from sqlalchemy.orm import Session
from auth.oauth2 import create_access_token, create_refresh_token, get_current_user
from auth.mfa import verify_mfa, enable_mfa, disable_mfa
from auth.social_login import router as social_login_router
from models import user as models
from models.refresh_token import RefreshToken
from schemas.token import Token, RefreshTokenRequest
from schemas.mfa import EnableMFA, VerifyMFA
from utils import hashing, database
from utils.cache import get_cached_data, set_cached_data
from middleware.audit_log import log_action

router = APIRouter(tags=['Authentication'])
router.include_router(social_login_router)

@router.post('/token', response_model=Token, dependencies=[Depends(RateLimiter(times=5, seconds=60))])
def login(request: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(database.get_db)):
    user = db.query(models.User).filter(models.User.email == request.username).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Invalid Credentials")
    if not hashing.Hash.verify(user.password, request.password):
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Incorrect password")
    if user.mfa_enabled:
        return {"message": "MFA required", "mfa_required": True}
    access_token = create_access_token(data={"sub": user.email})
    refresh_token = create_refresh_token(user.id, db)
    log_action(user.id, "User Login", "User logged in successfully", db)
    return {"access_token": access_token, "token_type": "bearer", "refresh_token": refresh_token.token}

@router.post('/verify-mfa', response_model=Token, dependencies=[Depends(RateLimiter(times=5, seconds=60))])
def verify_mfa_route(request: VerifyMFA, db: Session = Depends(database.get_db), user: models.User = Depends(get_current_user)):
    if not verify_mfa(request.otp, user.mfa_secret):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid OTP")
    access_token = create_access_token(data={"sub": user.email})
    refresh_token = create_refresh_token(user.id, db)
    log_action(user.id, "MFA Verification", "User verified MFA successfully", db)
    return {"access_token": access_token, "token_type": "bearer", "refresh_token": refresh_token.token}

@router.get('/roles', dependencies=[Depends(RateLimiter(times=5, seconds=60))])
def get_roles(db: Session = Depends(database.get_db)):
    cached_roles = get_cached_data('roles')
    if cached_roles:
        return cached_roles
    roles = db.query(models.Role).all()
    set_cached_data('roles', roles)
    return roles

@router.get('/permissions', dependencies=[Depends(RateLimiter(times=5, seconds=60))])
def get_permissions(db: Session = Depends(database.get_db)):
    cached_permissions = get_cached_data('permissions')
    if cached_permissions:
        return cached_permissions
    permissions = db.query(models.Permission).all()
    set_cached_data('permissions', permissions)
    return permissions