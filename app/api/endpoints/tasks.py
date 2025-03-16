from typing import Any, List, Optional

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.services.auth import get_current_user
from app.services.task_scheduler import create_task, get_task, get_tasks, cancel_task
from app.schemas.task import TaskCreate, TaskResponse, TaskStatus

router = APIRouter()

@router.post("", response_model=TaskResponse)
def create_new_task(
    task_in: TaskCreate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
) -> Any:
    """
    创建新任务
    """
    task = create_task(db=db, task_in=task_in, user_id=current_user.id)
    return task

@router.get("", response_model=List[TaskResponse])
def read_tasks(
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user),
    skip: int = 0,
    limit: int = 100,
    status: Optional[str] = None
) -> Any:
    """
    获取任务列表
    """
    tasks = get_tasks(db=db, user_id=current_user.id, skip=skip, limit=limit, status=status)
    return tasks

@router.get("/{task_id}", response_model=TaskResponse)
def read_task(
    task_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
) -> Any:
    """
    获取任务详情
    """
    task = get_task(db=db, task_id=task_id)
    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="任务不存在"
        )
    # 检查权限
    if task.assignee_id != current_user.id and task.creator_id != current_user.id:
        # 这里可以添加管理员权限检查
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="没有权限访问此任务"
        )
    return task

@router.post("/{task_id}/cancel", response_model=TaskStatus)
def cancel_existing_task(
    task_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
) -> Any:
    """
    取消任务
    """
    task = get_task(db=db, task_id=task_id)
    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="任务不存在"
        )
    # 检查权限
    if task.assignee_id != current_user.id and task.creator_id != current_user.id:
        # 这里可以添加管理员权限检查
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="没有权限取消此任务"
        )
    
    result = cancel_task(db=db, task_id=task_id)
    if not result:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="任务无法取消，可能已完成或已取消"
        )
    return {"task_id": task_id, "status": "canceled", "message": "任务已取消"} 