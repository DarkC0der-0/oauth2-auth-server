import pyotp
from sqlalchemy.orm import Session
from models import user as models

def generate_mfa_secret():
    return pyotp.random_base32()

def verify_mfa(otp: str, secret: str):
    totp = pyotp.TOTP(secret)
    return totp.verify(otp)

def enable_mfa(user: models.User, db: Session):
    secret = generate_mfa_secret()
    user.mfa_enabled = True
    user.mfa_secret = secret
    db.commit()
    db.refresh(user)
    return secret

def disable_mfa(user: models.User, db: Session):
    user.mfa_enabled = False
    user.mfa_secret = None
    db.commit()
    db.refresh(user)