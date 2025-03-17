from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field
from datetime import datetime

class ToolBase(BaseModel):
    """工具基础模型"""
    name: str
    type: str  # api, script, etc.
    endpoint: Optional[str] = None
    description: Optional[str] = None
    auth_type: Optional[str] = None
    required_role: Optional[str] = None
    # MCP相关字段
    input_schema: Optional[Dict[str, Any]] = None
    capabilities: Optional[List[str]] = None

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
    # MCP相关字段
    input_schema: Optional[Dict[str, Any]] = None
    capabilities: Optional[List[str]] = None

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
    # MCP相关字段
    context_id: Optional[str] = None
    client_id: Optional[str] = None

class ToolInvocationResponse(BaseModel):
    """工具调用响应模型"""
    invoke_id: str
    tool_id: int
    status: str
    output: Optional[Dict[str, Any]] = None
    error: Optional[str] = None
    started_at: datetime
    finished_at: Optional[datetime] = None
    # MCP相关字段
    context_id: Optional[str] = None
    client_id: Optional[str] = None

    class Config:
        from_attributes = True

# MCP特定模型
class MCPToolDefinition(BaseModel):
    """MCP工具定义模型"""
    name: str
    description: Optional[str] = None
    capabilities: Optional[List[str]] = None
    inputSchema: Dict[str, Any] = Field(..., description="JSON Schema for the tool's parameters")

class MCPToolsListResponse(BaseModel):
    """MCP工具列表响应"""
    tools: List[MCPToolDefinition]
    nextCursor: Optional[str] = None

class MCPToolCallRequest(BaseModel):
    """MCP工具调用请求"""
    name: str
    arguments: Dict[str, Any]

class MCPToolCallResponse(BaseModel):
    """MCP工具调用响应"""
    content: List[Dict[str, Any]]

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