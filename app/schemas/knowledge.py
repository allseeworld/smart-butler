from typing import List, Optional, Dict, Any
from pydantic import BaseModel
from datetime import datetime

class ShortTermMemoryCreate(BaseModel):
    """短期记忆创建模型"""
    task_id: int
    content: str

class MemoryItem(BaseModel):
    """记忆条目模型"""
    timestamp: datetime
    content: str

class ShortTermMemoryResponse(BaseModel):
    """短期记忆响应模型"""
    task_id: int
    memories: List[MemoryItem]

class KnowledgeTagBase(BaseModel):
    """知识标签基础模型"""
    name: str

class KnowledgeTagCreate(KnowledgeTagBase):
    """知识标签创建模型"""
    pass

class KnowledgeTagResponse(KnowledgeTagBase):
    """知识标签响应模型"""
    id: int
    created_at: datetime

    class Config:
        from_attributes = True

class KnowledgeBase(BaseModel):
    """知识条目基础模型"""
    title: str
    content: str
    source: Optional[str] = None

class KnowledgeCreate(KnowledgeBase):
    """知识条目创建模型"""
    tags: Optional[List[str]] = None  # 标签名称列表

class KnowledgeUpdate(BaseModel):
    """知识条目更新模型"""
    title: Optional[str] = None
    content: Optional[str] = None
    source: Optional[str] = None
    tags: Optional[List[str]] = None

class KnowledgeResponse(KnowledgeBase):
    """知识条目响应模型"""
    id: int
    creator_id: int
    tags: List[KnowledgeTagResponse]
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class KnowledgeSearchResult(BaseModel):
    """知识搜索结果条目模型"""
    knowledge_id: int
    title: str
    snippet: str  # 内容摘要
    score: float  # 相关度评分

class KnowledgeSearchResponse(BaseModel):
    """知识搜索响应模型"""
    query: str
    results: List[KnowledgeSearchResult] 