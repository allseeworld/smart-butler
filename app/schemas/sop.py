from typing import List, Optional, Dict, Any
from pydantic import BaseModel
from datetime import datetime

class SOPStepBase(BaseModel):
    """SOP步骤基础模型"""
    order: int
    name: str
    action: str  # invoke_tool, manual_approval, etc.
    params: Optional[Dict[str, Any]] = None
    assignee_role: Optional[str] = None
    timeout: Optional[int] = None

class SOPTemplateBase(BaseModel):
    """SOP模板基础模型"""
    name: str
    description: Optional[str] = None
    version: Optional[str] = "1.0"

class SOPTemplateCreate(SOPTemplateBase):
    """SOP模板创建模型"""
    steps: List[SOPStepBase]

class SOPTemplateUpdate(BaseModel):
    """SOP模板更新模型"""
    name: Optional[str] = None
    description: Optional[str] = None
    version: Optional[str] = None
    steps: Optional[List[SOPStepBase]] = None

class SOPTemplateResponse(SOPTemplateBase):
    """SOP模板响应模型"""
    id: int
    creator_id: int
    steps: List[SOPStepBase]
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class SOPStepExecutionResponse(BaseModel):
    """SOP步骤执行响应模型"""
    step_order: int
    step_name: str
    status: str
    started_at: Optional[datetime] = None
    ended_at: Optional[datetime] = None
    result: Optional[Dict[str, Any]] = None
    error: Optional[str] = None

    class Config:
        from_attributes = True

class SOPRunCreate(BaseModel):
    """SOP流程执行创建模型"""
    template_id: int
    context: Optional[Dict[str, Any]] = None

class SOPRunResponse(BaseModel):
    """SOP流程执行响应模型"""
    id: str
    template_id: int
    initiator_id: int
    status: str
    current_step: Optional[int] = None
    context: Optional[Dict[str, Any]] = None
    steps: List[SOPStepExecutionResponse]
    started_at: datetime
    finished_at: Optional[datetime] = None
    result: Optional[Dict[str, Any]] = None

    class Config:
        from_attributes = True 