from sqlalchemy import Column, Integer, String, ForeignKey, Boolean
from sqlalchemy.orm import relationship
from utils.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    email = Column(String, unique=True, index=True)
    password = Column(String, nullable=True)
    role_id = Column(Integer, ForeignKey('roles.id'))
    mfa_enabled = Column(Boolean, default=False)
    mfa_secret = Column(String, nullable=True)
    social_provider = Column(String, nullable=True)
    social_id = Column(String, nullable=True)

    role = relationship("Role", back_populates="users")
    refresh_tokens = relationship("RefreshToken", back_populates="user")