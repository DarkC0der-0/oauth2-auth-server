from sqlalchemy.orm import Session
from models.audit_log import AuditLog
from utils.database import get_db
from fastapi import Request, Depends
from datetime import datetime

def log_action(user_id: int, action: str, details: str, db: Session):
    audit_log = AuditLog(user_id=user_id, action=action, details=details, timestamp=datetime.utcnow())
    db.add(audit_log)
    db.commit()

async def audit_log_middleware(request: Request, call_next):
    db = get_db()
    user_id = request.headers.get("X-User-Id")
    response = await call_next(request)
    
    if request.url.path in ["/token", "/users/{user_id}/role", "/users/{user_id}/password"]:
        action = "User Login" if request.url.path == "/token" else "Role Change" if "/role" in request.url.path else "Password Reset"
        details = f"Path: {request.url.path}, Method: {request.method}"
        log_action(user_id, action, details, db)

    return response