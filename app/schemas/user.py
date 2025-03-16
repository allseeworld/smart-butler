from typing import List, Optional
from pydantic import BaseModel, EmailStr
from datetime import datetime

class RoleBase(BaseModel):
    """角色基础模型"""
    name: str
    description: Optional[str] = None

class RoleCreate(RoleBase):
    """角色创建模型"""
    pass

class RoleResponse(RoleBase):
    """角色响应模型"""
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class UserBase(BaseModel):
    """用户基础模型"""
    username: str
    email: Optional[EmailStr] = None
    full_name: Optional[str] = None
    is_active: bool = True
    is_superuser: bool = False

class UserCreate(UserBase):
    """用户创建模型"""
    password: str
    roles: List[str]  # 角色名称列表

class UserUpdate(BaseModel):
    """用户更新模型"""
    email: Optional[EmailStr] = None
    full_name: Optional[str] = None
    is_active: Optional[bool] = None

class UserRolesUpdate(BaseModel):
    """用户角色更新模型"""
    roles: List[str]  # 角色名称列表

class UserResponse(UserBase):
    """用户响应模型"""
    id: int
    roles: List[RoleResponse]
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True 