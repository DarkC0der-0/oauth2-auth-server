import pytest
from fastapi.testclient import TestClient
from sqlalchemy.orm import sessionmaker
from sqlalchemy import create_engine
from models import user as models
from utils.database import Base, get_db
from auth.mfa import generate_mfa_secret, verify_mfa
import pyotp
from main import app
from auth import hashing

DATABASE_URL = "sqlite:///./test.db"
engine = create_engine(DATABASE_URL)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

@pytest.fixture(scope="module")
def client():
    Base.metadata.create_all(bind=engine)
    with TestClient(app) as c:
        yield c
    Base.metadata.drop_all(bind=engine)

@pytest.fixture(scope="module")
def db():
    session = TestingSessionLocal()
    yield session
    session.close()

@pytest.fixture(scope="module")
def test_user(db):
    user = models.User(username="testuser", email="testuser@example.com", password=hashing.Hash.bcrypt("password"))
    db.add(user)
    db.commit()
    db.refresh(user)
    return user

def test_enable_mfa(client, test_user):
    secret = generate_mfa_secret()
    test_user.mfa_secret = secret
    test_user.mfa_enabled = True
    db.add(test_user)
    db.commit()

    otp = pyotp.TOTP(secret).now()
    token = "mocked_valid_token" 
    response = client.post("/verify-mfa", json={"otp": otp}, headers={"Authorization": f"Bearer {token}"})
    assert response.status_code == 200
    assert "access_token" in response.json()