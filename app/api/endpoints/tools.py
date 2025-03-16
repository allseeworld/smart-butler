from typing import Any, List, Optional

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.services.auth import get_current_user, get_current_active_superuser
from app.services.tool_manager import register_tool, get_tools, invoke_tool, get_tool_invocation
from app.schemas.tool import ToolCreate, ToolResponse, ToolInvoke, ToolInvocationResponse

router = APIRouter()

@router.post("", response_model=ToolResponse)
def register_new_tool(
    tool_in: ToolCreate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_active_superuser)  # 只有管理员可以注册工具
) -> Any:
    """
    注册新工具
    """
    tool = register_tool(db=db, tool_in=tool_in)
    return tool

@router.get("", response_model=List[ToolResponse])
def read_tools(
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user),
    skip: int = 0,
    limit: int = 100,
    status: Optional[str] = None
) -> Any:
    """
    获取工具列表
    """
    tools = get_tools(db=db, skip=skip, limit=limit, status=status)
    return tools

@router.post("/{tool_id}/invoke", response_model=ToolInvocationResponse)
def invoke_existing_tool(
    tool_id: int,
    invoke_params: ToolInvoke,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
) -> Any:
    """
    调用工具
    """
    # 这里可以添加权限检查，确认用户是否有权限调用该工具
    result = invoke_tool(db=db, tool_id=tool_id, params=invoke_params.params, user_id=current_user.id)
    if not result:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="工具不存在或无法调用"
        )
    return result

@router.get("/invocations/{invoke_id}", response_model=ToolInvocationResponse)
def get_tool_invocation_status(
    invoke_id: str,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
) -> Any:
    """
    获取工具调用状态
    """
    invocation = get_tool_invocation(db=db, invoke_id=invoke_id)
    if not invocation:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="调用记录不存在"
        )
    # 这里可以添加权限检查，确认用户是否有权限查看该调用记录
    return invocation 