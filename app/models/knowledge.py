from sqlalchemy import Boolean, Column, Integer, String, Text, ForeignKey, DateTime, JSON, Table, Float, LargeBinary
from sqlalchemy.orm import relationship
from datetime import datetime

from app.db.session import Base

# 知识条目-标签关联表（多对多）
knowledge_tag = Table(
    "knowledge_tag",
    Base.metadata,
    Column("knowledge_id", Integer, ForeignKey("knowledge_entries.id"), primary_key=True),
    Column("tag_id", Integer, ForeignKey("knowledge_tags.id"), primary_key=True)
)

class KnowledgeEntry(Base):
    """知识条目模型"""
    __tablename__ = "knowledge_entries"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    content = Column(Text, nullable=False)
    source = Column(String, nullable=True)  # 知识来源
    creator_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # 关系
    creator = relationship("User")
    tags = relationship("KnowledgeTag", secondary=knowledge_tag, back_populates="entries")
    vector_embeddings = relationship("KnowledgeEmbedding", back_populates="knowledge_entry")

class KnowledgeTag(Base):
    """知识标签模型"""
    __tablename__ = "knowledge_tags"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False, unique=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    # 关系
    entries = relationship("KnowledgeEntry", secondary=knowledge_tag, back_populates="tags")

class KnowledgeEmbedding(Base):
    """知识向量嵌入模型"""
    __tablename__ = "knowledge_embeddings"

    id = Column(Integer, primary_key=True, index=True)
    knowledge_id = Column(Integer, ForeignKey("knowledge_entries.id"), nullable=False)
    embedding = Column(LargeBinary, nullable=False)  # 存储向量嵌入的二进制数据
    model = Column(String, nullable=False)  # 使用的嵌入模型，如 "openai"
    created_at = Column(DateTime, default=datetime.utcnow)

    # 关系
    knowledge_entry = relationship("KnowledgeEntry", back_populates="vector_embeddings")

class ShortTermMemory(Base):
    """短期记忆模型（可选，如果不使用Redis存储）"""
    __tablename__ = "short_term_memories"

    id = Column(Integer, primary_key=True, index=True)
    task_id = Column(Integer, ForeignKey("tasks.id"), nullable=False)
    content = Column(Text, nullable=False)
    timestamp = Column(DateTime, default=datetime.utcnow)

    # 关系
    task = relationship("Task") 