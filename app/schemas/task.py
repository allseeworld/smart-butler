from typing import List, Optional, Dict, Any, Union
from pydantic import BaseModel, Field
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
    title: str = Field(..., description="任务标题")
    description: Optional[str] = Field(None, description="任务描述")
    priority: Optional[str] = Field("medium", description="任务优先级")
    deadline: Optional[datetime] = Field(None, description="截止日期")
    sop_id: Optional[str] = Field(None, description="关联的SOP模板ID")

class TaskCreate(TaskBase):
    """创建任务请求模型"""
    assignee_id: Optional[int] = Field(None, description="指派给的用户ID")
    tags: Optional[List[str]] = Field(None, description="任务标签")

class TaskUpdate(BaseModel):
    """更新任务请求模型"""
    title: Optional[str] = Field(None, description="任务标题")
    description: Optional[str] = Field(None, description="任务描述")
    status: Optional[str] = Field(None, description="任务状态")
    priority: Optional[str] = Field(None, description="任务优先级")
    deadline: Optional[datetime] = Field(None, description="截止日期")
    assignee_id: Optional[int] = Field(None, description="指派给的用户ID")
    tags: Optional[List[str]] = Field(None, description="任务标签")

class TaskResponse(TaskBase):
    """任务响应模型"""
    id: str = Field(..., description="任务ID")
    status: str = Field(..., description="任务状态")
    created_at: str = Field(..., description="创建时间")
    updated_at: str = Field(..., description="更新时间")
    creator_id: Optional[int] = Field(None, description="创建者ID")
    assignee_id: Optional[int] = Field(None, description="指派给的用户ID")
    tags: Optional[List[str]] = Field(None, description="任务标签")
    
    class Config:
        orm_mode = True

class TaskStatus(BaseModel):
    """任务状态模型"""
    id: str = Field(..., description="任务ID")
    status: str = Field(..., description="任务状态")
    message: Optional[str] = Field(None, description="状态消息")

class TaskList(BaseModel):
    """任务列表响应模型"""
    tasks: List[Dict[str, Any]] = Field(..., description="任务列表")
    total: int = Field(..., description="总数")

class TaskExecutionRequest(BaseModel):
    """任务执行请求模型"""
    description: str = Field(..., description="任务描述")
    sop_id: Optional[str] = Field(None, description="SOP模板ID")
    parameters: Optional[Dict[str, Any]] = Field(None, description="执行参数")
    use_reflection: bool = Field(False, description="是否使用反思Agent")
    use_siliconflow: bool = Field(False, description="是否使用硅基流动模型")

class TaskExecutionResponse(BaseModel):
    """任务执行响应模型"""
    task_id: str = Field(..., description="任务ID")
    status: str = Field(..., description="执行状态")
    message: str = Field(..., description="执行消息")

class TaskExecutionResult(BaseModel):
    """任务执行结果模型"""
    task_id: str = Field(..., description="任务ID")
    status: str = Field(..., description="执行状态")
    execution_time: float = Field(..., description="执行时间(秒)")
    result: Dict[str, Any] = Field(..., description="执行结果")
    timestamp: str = Field(..., description="时间戳")

class TaskStep(BaseModel):
    """任务步骤模型"""
    order: int = Field(..., description="步骤顺序")
    description: str = Field(..., description="步骤描述")
    status: str = Field(..., description="步骤状态")
    result: Optional[Dict[str, Any]] = Field(None, description="步骤结果")
    started_at: Optional[str] = Field(None, description="开始时间")
    completed_at: Optional[str] = Field(None, description="完成时间")

class AgentComparisonRequest(BaseModel):
    """Agent比较请求模型"""
    description: str = Field(..., description="任务描述")
    sop_id: Optional[str] = Field(None, description="SOP模板ID")
    parameters: Optional[Dict[str, Any]] = Field(None, description="执行参数")
    use_siliconflow: bool = Field(False, description="是否包含硅基流动模型")

class AgentComparisonResponse(BaseModel):
    """Agent比较响应模型"""
    task_id: str = Field(..., description="任务ID")
    status: str = Field(..., description="执行状态")
    message: str = Field(..., description="执行消息")

class AgentComparisonResult(BaseModel):
    """Agent比较结果模型"""
    task_id: str = Field(..., description="任务ID")
    task_description: str = Field(..., description="任务描述")
    standard_agent: Dict[str, Any] = Field(..., description="标准Agent结果")
    reflection_agent: Dict[str, Any] = Field(..., description="反思Agent结果")
    total_time: float = Field(..., description="总执行时间(秒)")
    timestamp: str = Field(..., description="时间戳") 