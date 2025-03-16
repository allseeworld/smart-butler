from typing import List, Optional, Dict, Any
from pydantic import BaseModel
from datetime import datetime

class ToolBase(BaseModel):
    """工具基础模型"""
    name: str
    type: str  # api, script, etc.
    endpoint: Optional[str] = None
    description: Optional[str] = None
    auth_type: Optional[str] = None
    required_role: Optional[str] = None

class ToolCreate(ToolBase):
    """工具创建模型"""
    auth_info: Optional[Dict[str, Any]] = None

class ToolUpdate(BaseModel):
    """工具更新模型"""
    name: Optional[str] = None
    endpoint: Optional[str] = None
    description: Optional[str] = None
    auth_type: Optional[str] = None
    auth_info: Optional[Dict[str, Any]] = None
    required_role: Optional[str] = None
    status: Optional[str] = None

class ToolResponse(ToolBase):
    """工具响应模型"""
    id: int
    status: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class ToolInvoke(BaseModel):
    """工具调用请求模型"""
    params: Dict[str, Any]

class ToolInvocationResponse(BaseModel):
    """工具调用响应模型"""
    invoke_id: str
    tool_id: int
    status: str
    output: Optional[Dict[str, Any]] = None
    error: Optional[str] = None
    started_at: datetime
    finished_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class ToolApprovalBase(BaseModel):
    """工具审批基础模型"""
    tool_id: int
    reason: Optional[str] = None

class ToolApprovalCreate(ToolApprovalBase):
    """工具审批创建模型"""
    pass

class ToolApprovalUpdate(BaseModel):
    """工具审批更新模型"""
    status: str
    approver_id: int

class ToolApprovalResponse(ToolApprovalBase):
    """工具审批响应模型"""
    id: int
    requester_id: int
    approver_id: Optional[int] = None
    status: str
    created_at: datetime
    updated_at: datetime
    approved_at: Optional[datetime] = None

    class Config:
        from_attributes = True 