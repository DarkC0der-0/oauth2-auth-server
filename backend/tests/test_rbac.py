import pytest
from fastapi.testclient import TestClient
from sqlalchemy.orm import sessionmaker
from models import user as models, role as role_models
from utils.database import Base, get_db
from main import app
from sqlalchemy import create_engine
from utils import hashing
from utils import create_access_token

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
    role = role_models.Role(name="admin", description="Admin role")
    db.add(role)
    db.commit()
    db.refresh(role)

    user = models.User(username="testuser", email="testuser@example.com", password=hashing.Hash.bcrypt("password"), role_id=role.id)
    db.add(user)
    db.commit()
    db.refresh(user)
    return user

def test_role_based_access(client, test_user):
    token = create_access_token(data={"sub": test_user.email})
    response = client.get("/admin-route", headers={"Authorization": f"Bearer {token}"})
    assert response.status_code == 200
    assert response.json()["message"] == "This route is for admin users only"