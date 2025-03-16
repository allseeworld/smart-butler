from sqlalchemy import Boolean, Column, Integer, String, Text, ForeignKey, DateTime, JSON, Table
from sqlalchemy.orm import relationship
from datetime import datetime

from app.db.session import Base

# 任务-标签关联表（多对多）
task_tag = Table(
    "task_tag",
    Base.metadata,
    Column("task_id", Integer, ForeignKey("tasks.id"), primary_key=True),
    Column("tag_id", Integer, ForeignKey("tags.id"), primary_key=True)
)

class Task(Base):
    """任务模型"""
    __tablename__ = "tasks"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    status = Column(String, nullable=False, default="pending")  # pending, in_progress, completed, failed, canceled
    priority = Column(String, nullable=True)  # 高, 中, 低
    progress = Column(Integer, default=0)  # 进度百分比 0-100
    
    creator_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    assignee_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    project_id = Column(Integer, ForeignKey("projects.id"), nullable=True)
    
    due_date = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    started_at = Column(DateTime, nullable=True)
    finished_at = Column(DateTime, nullable=True)
    
    result = Column(JSON, nullable=True)  # 任务结果，JSON格式

    # 关系
    creator = relationship("User", foreign_keys=[creator_id], back_populates="tasks_created")
    assignee = relationship("User", foreign_keys=[assignee_id], back_populates="tasks_assigned")
    project = relationship("Project", back_populates="tasks")
    tags = relationship("Tag", secondary=task_tag, back_populates="tasks")
    subtasks = relationship("Subtask", back_populates="parent_task")
    attachments = relationship("Attachment", back_populates="task")
    comments = relationship("Comment", back_populates="task")

class Subtask(Base):
    """子任务模型"""
    __tablename__ = "subtasks"

    id = Column(Integer, primary_key=True, index=True)
    parent_task_id = Column(Integer, ForeignKey("tasks.id"), nullable=False)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    status = Column(String, nullable=False, default="pending")  # pending, in_progress, completed, failed
    order = Column(Integer, default=0)  # 排序顺序
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # 关系
    parent_task = relationship("Task", back_populates="subtasks")

class Project(Base):
    """项目模型"""
    __tablename__ = "projects"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # 关系
    tasks = relationship("Task", back_populates="project")

class Tag(Base):
    """标签模型"""
    __tablename__ = "tags"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False, unique=True)
    color = Column(String, nullable=True)  # 颜色代码
    created_at = Column(DateTime, default=datetime.utcnow)

    # 关系
    tasks = relationship("Task", secondary=task_tag, back_populates="tags")

class Attachment(Base):
    """附件模型"""
    __tablename__ = "attachments"

    id = Column(Integer, primary_key=True, index=True)
    task_id = Column(Integer, ForeignKey("tasks.id"), nullable=False)
    filename = Column(String, nullable=False)
    file_path = Column(String, nullable=False)  # MinIO中的路径
    file_size = Column(Integer, nullable=True)
    content_type = Column(String, nullable=True)
    uploaded_by = Column(Integer, ForeignKey("users.id"), nullable=False)
    uploaded_at = Column(DateTime, default=datetime.utcnow)

    # 关系
    task = relationship("Task", back_populates="attachments")
    uploader = relationship("User")

class Comment(Base):
    """评论模型"""
    __tablename__ = "comments"

    id = Column(Integer, primary_key=True, index=True)
    task_id = Column(Integer, ForeignKey("tasks.id"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    content = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # 关系
    task = relationship("Task", back_populates="comments")
    user = relationship("User") 