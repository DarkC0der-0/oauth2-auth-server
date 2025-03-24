from fastapi import HTTPException, status
from sqlalchemy.orm import Session
from models import user as models

def get_user_role(user_id: int, db: Session):
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if user:
        return user.role
    raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

def get_user_permissions(role_id: int, db: Session):
    role = db.query(models.Role).filter(models.Role.id == role_id).first()
    if role:
        return [permission.name for permission in role.permissions]
    raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Role not found")