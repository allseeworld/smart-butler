from typing import Any, List, Optional

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.services.auth import get_current_user, get_current_active_superuser
from app.services.auth import create_user, get_users, get_user, update_user_roles
from app.schemas.user import UserCreate, UserResponse, UserRolesUpdate

router = APIRouter()

@router.post("", response_model=UserResponse)
def create_new_user(
    user_in: UserCreate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_active_superuser)  # 只有管理员可以创建用户
) -> Any:
    """
    创建新用户
    """
    user = create_user(db=db, user_in=user_in)
    return user

@router.get("", response_model=List[UserResponse])
def read_users(
    db: Session = Depends(get_db),
    current_user = Depends(get_current_active_superuser),  # 只有管理员可以查看用户列表
    skip: int = 0,
    limit: int = 100,
    role: Optional[str] = None
) -> Any:
    """
    获取用户列表
    """
    users = get_users(db=db, skip=skip, limit=limit, role=role)
    return users

@router.get("/me", response_model=UserResponse)
def read_user_me(
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
) -> Any:
    """
    获取当前用户信息
    """
    return current_user

@router.get("/{user_id}", response_model=UserResponse)
def read_user(
    user_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_active_superuser)  # 只有管理员可以查看其他用户详情
) -> Any:
    """
    获取用户详情
    """
    user = get_user(db=db, user_id=user_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="用户不存在"
        )
    return user

@router.put("/{user_id}/roles", response_model=UserResponse)
def update_roles(
    user_id: int,
    roles_in: UserRolesUpdate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_active_superuser)  # 只有管理员可以更新用户角色
) -> Any:
    """
    更新用户角色
    """
    user = get_user(db=db, user_id=user_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="用户不存在"
        )
    
    user = update_user_roles(db=db, user_id=user_id, roles=roles_in.roles)
    return user 