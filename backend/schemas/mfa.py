from pydantic import BaseModel

class EnableMFA(BaseModel):
    mfa_enabled: bool

class VerifyMFA(BaseModel):
    otp: str