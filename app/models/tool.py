from sqlalchemy import Boolean, Column, Integer, String, Text, ForeignKey, DateTime, JSON
from sqlalchemy.orm import relationship
from datetime import datetime

from app.db.session import Base

class Tool(Base):
    """工具模型"""
    __tablename__ = "tools"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False, unique=True)
    type = Column(String, nullable=False)  # api, script, etc.
    endpoint = Column(String, nullable=True)  # API URL或脚本路径
    description = Column(Text, nullable=True)
    auth_type = Column(String, nullable=True)  # apiKey, OAuth2, None, etc.
    auth_info = Column(JSON, nullable=True)  # 认证信息，JSON格式
    required_role = Column(String, nullable=True)  # 使用该工具所需的最低角色
    status = Column(String, nullable=False, default="active")  # active, inactive
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # MCP相关字段
    input_schema = Column(JSON, nullable=True)  # 工具输入参数的JSON Schema
    capabilities = Column(JSON, nullable=True)  # 工具能力描述，如["clause analysis", "risk identification"]

    # 关系
    invocations = relationship("ToolInvocation", back_populates="tool")

class ToolInvocation(Base):
    """工具调用记录模型"""
    __tablename__ = "tool_invocations"

    id = Column(Integer, primary_key=True, index=True)
    invoke_id = Column(String, unique=True, nullable=False)  # 调用ID，使用UUID
    tool_id = Column(Integer, ForeignKey("tools.id"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    params = Column(JSON, nullable=True)  # 调用参数，JSON格式
    status = Column(String, nullable=False, default="running")  # running, success, failed
    output = Column(JSON, nullable=True)  # 调用结果，JSON格式
    error = Column(Text, nullable=True)  # 错误信息
    started_at = Column(DateTime, default=datetime.utcnow)
    finished_at = Column(DateTime, nullable=True)
    
    # MCP相关字段
    context_id = Column(String, nullable=True)  # MCP上下文ID
    client_id = Column(String, nullable=True)  # MCP客户端ID

    # 关系
    tool = relationship("Tool", back_populates="invocations")
    user = relationship("User")

class ToolApproval(Base):
    """工具调用审批模型"""
    __tablename__ = "tool_approvals"

    id = Column(Integer, primary_key=True, index=True)
    tool_id = Column(Integer, ForeignKey("tools.id"), nullable=False)
    requester_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    approver_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    reason = Column(Text, nullable=True)  # 申请理由
    status = Column(String, nullable=False, default="pending")  # pending, approved, rejected
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    approved_at = Column(DateTime, nullable=True)

    # 关系
    tool = relationship("Tool")
    requester = relationship("User", foreign_keys=[requester_id])
    approver = relationship("User", foreign_keys=[approver_id]) 