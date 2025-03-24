import pytest
from fastapi.testclient import TestClient
from sqlalchemy.orm import sessionmaker
from sqlalchemy import create_engine
from models import user as models
from utils.database import Base, get_db
from auth.oauth2 import create_access_token
from main import app
from utils import hashing

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

def test_generate_token(test_user):
    token = create_access_token(data={"sub": test_user.email})
    assert token is not None

def test_validate_token(client, test_user):
    token = create_access_token(data={"sub": test_user.email})
    response = client.get("/protected-route", headers={"Authorization": f"Bearer {token}"})
    assert response.status_code == 200
    assert response.json()["user"] == test_user.email