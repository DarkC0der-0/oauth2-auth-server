from pydantic import BaseModel
from typing import Optional

class User(BaseModel):
    email: str
    password: str

    class Config:
        orm_mode = True

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None