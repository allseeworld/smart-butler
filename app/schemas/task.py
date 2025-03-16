from typing import List, Optional, Dict, Any, Union
from pydantic import BaseModel
from datetime import datetime

class UserInfo(BaseModel):
    """用户简要信息模型"""
    id: int
    username: str
    full_name: Optional[str] = None

    class Config:
        from_attributes = True

class TagBase(BaseModel):
    """标签基础模型"""
    name: str
    color: Optional[str] = None

class TagCreate(TagBase):
    """标签创建模型"""
    pass

class TagResponse(TagBase):
    """标签响应模型"""
    id: int
    created_at: datetime

    class Config:
        from_attributes = True

class SubtaskBase(BaseModel):
    """子任务基础模型"""
    title: str
    description: Optional[str] = None
    status: str = "pending"
    order: int = 0

class SubtaskCreate(SubtaskBase):
    """子任务创建模型"""
    pass

class SubtaskResponse(SubtaskBase):
    """子任务响应模型"""
    id: int
    parent_task_id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class TaskBase(BaseModel):
    """任务基础模型"""
    title: str
    description: Optional[str] = None
    priority: Optional[str] = None
    due_date: Optional[datetime] = None
    project_id: Optional[int] = None

class TaskCreate(TaskBase):
    """任务创建模型"""
    assignee_id: Optional[int] = None
    tags: Optional[List[str]] = None  # 标签名称列表
    subtasks: Optional[List[SubtaskCreate]] = None

class TaskUpdate(BaseModel):
    """任务更新模型"""
    title: Optional[str] = None
    description: Optional[str] = None
    status: Optional[str] = None
    priority: Optional[str] = None
    assignee_id: Optional[int] = None
    due_date: Optional[datetime] = None
    progress: Optional[int] = None

class TaskResponse(TaskBase):
    """任务响应模型"""
    id: int
    status: str
    progress: int
    creator: UserInfo
    assignee: Optional[UserInfo] = None
    tags: List[TagResponse]
    subtasks: List[SubtaskResponse]
    created_at: datetime
    updated_at: datetime
    started_at: Optional[datetime] = None
    finished_at: Optional[datetime] = None
    result: Optional[Dict[str, Any]] = None

    class Config:
        from_attributes = True

class TaskStatus(BaseModel):
    """任务状态模型"""
    task_id: int
    status: str
    message: Optional[str] = None 