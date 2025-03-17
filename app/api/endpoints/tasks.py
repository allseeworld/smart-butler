from typing import Any, List, Optional

from fastapi import APIRouter, Depends, HTTPException, Query, status, BackgroundTasks
from sqlalchemy.orm import Session
import uuid

from app.db.session import get_db
from app.services.auth import get_current_user
from app.services.task_scheduler import create_task, get_task, get_tasks, cancel_task
from app.schemas.task import (
    TaskCreate, 
    TaskResponse, 
    TaskList, 
    TaskStatus, 
    TaskUpdate,
    TaskExecutionRequest,
    TaskExecutionResponse,
    AgentComparisonRequest,
    AgentComparisonResponse
)
from app.services.task_scheduler.service import TaskSchedulerService

router = APIRouter()

@router.post("/", response_model=TaskResponse)
async def create_task(task: TaskCreate):
    """
    创建新任务
    """
    # 生成任务ID
    task_id = str(uuid.uuid4())
    
    # 这里应该将任务保存到数据库
    # 当前为示例实现
    return {
        "id": task_id,
        "title": task.title,
        "description": task.description,
        "status": "pending",
        "created_at": "2023-01-01T00:00:00",
        "updated_at": "2023-01-01T00:00:00"
    }

@router.get("/", response_model=TaskList)
async def list_tasks(
    status: Optional[str] = Query(None, description="按状态筛选任务"),
    limit: int = Query(10, description="返回结果数量限制")
):
    """
    获取任务列表
    """
    tasks = await TaskSchedulerService.list_tasks(status, limit)
    return {"tasks": tasks, "total": len(tasks)}

@router.get("/{task_id}", response_model=TaskResponse)
async def get_task(task_id: str):
    """
    获取任务详情
    """
    # 这里应该从数据库获取任务详情
    # 当前为示例实现
    return {
        "id": task_id,
        "title": "示例任务",
        "description": "这是一个示例任务",
        "status": "pending",
        "created_at": "2023-01-01T00:00:00",
        "updated_at": "2023-01-01T00:00:00"
    }

@router.put("/{task_id}", response_model=TaskResponse)
async def update_task(task_id: str, task_update: TaskUpdate):
    """
    更新任务
    """
    # 这里应该更新数据库中的任务
    # 当前为示例实现
    return {
        "id": task_id,
        "title": task_update.title,
        "description": task_update.description,
        "status": task_update.status,
        "created_at": "2023-01-01T00:00:00",
        "updated_at": "2023-01-01T00:00:00"
    }

@router.delete("/{task_id}", response_model=TaskStatus)
async def delete_task(task_id: str):
    """
    删除任务
    """
    # 这里应该从数据库删除任务
    # 当前为示例实现
    return {"id": task_id, "status": "deleted"}

@router.get("/{task_id}/status", response_model=TaskStatus)
async def get_task_status(task_id: str):
    """
    获取任务状态
    """
    status = await TaskSchedulerService.get_task_status(task_id)
    return {"id": task_id, "status": status["status"]}

@router.post("/{task_id}/cancel", response_model=TaskStatus)
async def cancel_task(task_id: str):
    """
    取消任务
    """
    result = await TaskSchedulerService.cancel_task(task_id)
    return {"id": task_id, "status": result["status"]}

@router.post("/{task_id}/execute", response_model=TaskExecutionResponse)
async def execute_task(
    task_id: str, 
    execution_request: TaskExecutionRequest,
    background_tasks: BackgroundTasks
):
    """
    使用Agent执行任务
    """
    # 在后台执行任务
    background_tasks.add_task(
        TaskSchedulerService.execute_task,
        task_id,
        execution_request.description,
        execution_request.use_reflection,
        execution_request.use_siliconflow
    )
    
    agent_type = "硅基流动" if execution_request.use_siliconflow else ("反思" if execution_request.use_reflection else "标准")
    
    return {
        "task_id": task_id,
        "status": "started",
        "message": f"任务已开始执行，使用{agent_type}Agent，请稍后查询结果"
    }

@router.post("/{task_id}/compare-agents", response_model=AgentComparisonResponse)
async def compare_agents(
    task_id: str,
    comparison_request: AgentComparisonRequest,
    background_tasks: BackgroundTasks
):
    """
    比较不同Agent的执行效果
    """
    # 在后台执行比较
    background_tasks.add_task(
        TaskSchedulerService.compare_agents,
        task_id,
        comparison_request.description,
        comparison_request.use_siliconflow
    )
    
    message = "已开始比较不同Agent的执行效果"
    if comparison_request.use_siliconflow:
        message += "（包含硅基流动模型）"
    
    return {
        "task_id": task_id,
        "status": "started",
        "message": message + "，请稍后查询结果"
    } 