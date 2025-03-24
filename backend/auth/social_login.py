from authlib.integrations.starlette_client import OAuth
from fastapi import APIRouter, Depends, HTTPException, status, Request
from fastapi.responses import RedirectResponse
from sqlalchemy.orm import Session
from models import user as models
from utils import database
from auth.oauth2 import create_access_token, create_refresh_token

oauth = OAuth()

# Register OAuth providers
oauth.register(
    name='google',
    client_id='GOOGLE_CLIENT_ID',
    client_secret='GOOGLE_CLIENT_SECRET',
    authorize_url='https://accounts.google.com/o/oauth2/auth',
    authorize_params=None,
    access_token_url='https://accounts.google.com/o/oauth2/token',
    access_token_params=None,
    refresh_token_url=None,
    redirect_uri='http://localhost:8000/auth/google/callback',
    client_kwargs={'scope': 'openid profile email'}
)

oauth.register(
    name='github',
    client_id='GITHUB_CLIENT_ID',
    client_secret='GITHUB_CLIENT_SECRET',
    authorize_url='https://github.com/login/oauth/authorize',
    authorize_params=None,
    access_token_url='https://github.com/login/oauth/access_token',
    access_token_params=None,
    refresh_token_url=None,
    redirect_uri='http://localhost:8000/auth/github/callback',
    client_kwargs={'scope': 'user:email'}
)

router = APIRouter(tags=['Social Login'])

@router.get('/auth/{provider}')
async def login_with_provider(provider: str, request: Request):
    redirect_uri = f'http://localhost:8000/auth/{provider}/callback'
    return await oauth.google.authorize_redirect(request, redirect_uri) if provider == 'google' else await oauth.github.authorize_redirect(request, redirect_uri)

@router.get('/auth/{provider}/callback')
async def auth_callback(provider: str, request: Request, db: Session = Depends(database.get_db)):
    token = await oauth.google.authorize_access_token(request) if provider == 'google' else await oauth.github.authorize_access_token(request)
    user_info = await oauth.google.parse_id_token(token) if provider == 'google' else await oauth.github.get('user', token=token)
    email = user_info.get('email')
    social_id = user_info.get('sub') if provider == 'google' else user_info.get('id')

    user = db.query(models.User).filter(models.User.email == email).first()
    if user:
        if user.social_id != social_id:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email already linked with another account")
    else:
        user = models.User(email=email, social_id=social_id, social_provider=provider)
        db.add(user)
        db.commit()
        db.refresh(user)

    access_token = create_access_token(data={"sub": user.email})
    refresh_token = create_refresh_token(user.id, db)
    response = RedirectResponse(url='/')
    response.set_cookie(key="access_token", value=f"Bearer {access_token}", httponly=True)
    return response