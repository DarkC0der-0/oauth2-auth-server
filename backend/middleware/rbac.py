from fastapi import Depends, HTTPException, status
from auth.oauth2 import get_current_user
from auth.roles import get_user_role, get_user_permissions
from sqlalchemy.orm import Session
from utils.database import get_db

def role_checker(required_roles: list):
    def role_checker_wrapper(user = Depends(get_current_user), db: Session = Depends(get_db)):
        user_role = get_user_role(user.id, db)
        if user_role.name not in required_roles:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Operation not permitted")
    return role_checker_wrapper

def permission_checker(required_permissions: list):
    def permission_checker_wrapper(user = Depends(get_current_user), db: Session = Depends(get_db)):
        user_role = get_user_role(user.id, db)
        user_permissions = get_user_permissions(user_role.id, db)
        if not any(permission in user_permissions for permission in required_permissions):
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Operation not permitted")
    return permission_checker_wrapper