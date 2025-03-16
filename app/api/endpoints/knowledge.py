from typing import Any, List, Optional

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.services.auth import get_current_user
from app.services.knowledge_manager import store_short_term_memory, get_short_term_memory, add_knowledge, search_knowledge, get_knowledge_entry
from app.schemas.knowledge import ShortTermMemoryCreate, ShortTermMemoryResponse, KnowledgeCreate, KnowledgeResponse, KnowledgeSearchResponse

router = APIRouter()

@router.post("/short-term", response_model=dict)
def store_memory(
    memory_in: ShortTermMemoryCreate,
    current_user = Depends(get_current_user)
) -> Any:
    """
    存储短期记忆
    """
    result = store_short_term_memory(task_id=memory_in.task_id, content=memory_in.content)
    return {"message": "Memory stored", "task_id": memory_in.task_id, "memory_id": result}

@router.get("/short-term", response_model=ShortTermMemoryResponse)
def get_memory(
    task_id: int,
    limit: Optional[int] = None,
    current_user = Depends(get_current_user)
) -> Any:
    """
    获取短期记忆
    """
    memories = get_short_term_memory(task_id=task_id, limit=limit)
    if not memories:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="没有找到相关记忆"
        )
    return {"task_id": task_id, "memories": memories}

@router.post("", response_model=dict)
def add_knowledge_entry(
    knowledge_in: KnowledgeCreate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
) -> Any:
    """
    添加知识条目
    """
    knowledge_id = add_knowledge(db=db, knowledge_in=knowledge_in, user_id=current_user.id)
    return {"knowledge_id": knowledge_id, "message": "Knowledge entry saved"}

@router.get("/search", response_model=KnowledgeSearchResponse)
def search_knowledge_entries(
    query: str,
    top_k: int = 5,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
) -> Any:
    """
    搜索知识库
    """
    results = search_knowledge(db=db, query=query, top_k=top_k)
    return {"query": query, "results": results}

@router.get("/{knowledge_id}", response_model=KnowledgeResponse)
def get_knowledge_entry_detail(
    knowledge_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
) -> Any:
    """
    获取知识条目详情
    """
    knowledge = get_knowledge_entry(db=db, knowledge_id=knowledge_id)
    if not knowledge:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="知识条目不存在"
        )
    return knowledge 