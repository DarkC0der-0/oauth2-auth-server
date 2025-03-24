import pytest
from fastapi.testclient import TestClient
from sqlalchemy.orm import sessionmaker
from sqlalchemy import create_engine
from models import user as models
from utils.database import Base, get_db
from auth.social_login import oauth
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
def mock_google_response(monkeypatch):
    class MockResponse:
        def json(self):
            return {"sub": "1234567890", "email": "testuser@example.com"}

    async def mock_parse_id_token(*args, **kwargs):
        return MockResponse().json()

    monkeypatch.setattr(oauth.google, "parse_id_token", mock_parse_id_token)

def test_google_login(client, mock_google_response):
    response = client.get("/auth/google/callback")
    assert response.status_code == 200
    assert "access_token" in response.cookies.get("access_token")