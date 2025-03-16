from sqlalchemy import Boolean, Column, Integer, String, Text, ForeignKey, DateTime, JSON
from sqlalchemy.orm import relationship
from datetime import datetime

from app.db.session import Base

class SOPTemplate(Base):
    """SOP模板模型"""
    __tablename__ = "sop_templates"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    version = Column(String, nullable=False, default="1.0")
    creator_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    steps = Column(JSON, nullable=False)  # 步骤配置，JSON格式

    # 关系
    creator = relationship("User")
    runs = relationship("SOPRun", back_populates="template")

class SOPRun(Base):
    """SOP流程执行实例模型"""
    __tablename__ = "sop_runs"

    id = Column(String, primary_key=True)  # 使用UUID或自定义ID
    template_id = Column(Integer, ForeignKey("sop_templates.id"), nullable=False)
    initiator_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    status = Column(String, nullable=False, default="running")  # running, completed, failed, canceled
    context = Column(JSON, nullable=True)  # 执行上下文，JSON格式
    current_step = Column(Integer, nullable=True)  # 当前执行到的步骤序号
    started_at = Column(DateTime, default=datetime.utcnow)
    finished_at = Column(DateTime, nullable=True)
    result = Column(JSON, nullable=True)  # 执行结果，JSON格式

    # 关系
    template = relationship("SOPTemplate", back_populates="runs")
    initiator = relationship("User")
    step_executions = relationship("SOPStepExecution", back_populates="sop_run")

class SOPStepExecution(Base):
    """SOP步骤执行记录模型"""
    __tablename__ = "sop_step_executions"

    id = Column(Integer, primary_key=True, index=True)
    sop_run_id = Column(String, ForeignKey("sop_runs.id"), nullable=False)
    step_order = Column(Integer, nullable=False)  # 步骤序号
    step_name = Column(String, nullable=False)
    status = Column(String, nullable=False, default="pending")  # pending, running, success, failed
    started_at = Column(DateTime, nullable=True)
    ended_at = Column(DateTime, nullable=True)
    result = Column(JSON, nullable=True)  # 步骤执行结果，JSON格式
    error = Column(Text, nullable=True)  # 错误信息

    # 关系
    sop_run = relationship("SOPRun", back_populates="step_executions") 