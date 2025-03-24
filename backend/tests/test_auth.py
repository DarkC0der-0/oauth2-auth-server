import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from models import user as models
from utils import hashing  
from utils.database import Base, get_db
from main import app

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

def test_register(client):
    response = client.post("/register", json={"username": "newuser", "email": "newuser@example.com", "password": "newpassword"})
    assert response.status_code == 200
    assert response.json()["email"] == "newuser@example.com"

def test_login(client, test_user):
    response = client.post("/token", data={"username": test_user.email, "password": "password"})
    assert response.status_code == 200
    assert "access_token" in response.json()