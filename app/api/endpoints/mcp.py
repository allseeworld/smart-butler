from typing import Any, List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.db.session import get_db
# 暂时注释掉认证
# from app.services.auth import get_current_user
from app.services.tool_manager import get_tools, invoke_tool, get_tool_invocation
from app.models.tool import Tool
from app.schemas.tool import (
    MCPToolDefinition, 
    MCPToolsListResponse, 
    MCPToolCallRequest, 
    MCPToolCallResponse
)

router = APIRouter()

@router.get("/tools/list", response_model=MCPToolsListResponse)
def list_mcp_tools(
    db: Session = Depends(get_db),
    # 暂时注释掉认证
    # current_user = Depends(get_current_user),
    cursor: Optional[str] = None,
    limit: int = 50
) -> Any:
    """
    列出可用的MCP工具
    
    符合MCP协议的工具列表端点
    """
    tools = get_tools(db=db, skip=0, limit=limit, status="active")
    
    # 转换为MCP格式
    mcp_tools = []
    for tool in tools:
        # 确保工具有输入模式
        if not tool.input_schema:
            continue
            
        mcp_tool = MCPToolDefinition(
            name=tool.name,
            description=tool.description,
            capabilities=tool.capabilities,
            inputSchema=tool.input_schema
        )
        mcp_tools.append(mcp_tool)
    
    return MCPToolsListResponse(
        tools=mcp_tools,
        nextCursor=None  # 简化实现，不支持分页
    )

@router.post("/tools/call", response_model=MCPToolCallResponse)
async def call_mcp_tool(
    request: MCPToolCallRequest,
    db: Session = Depends(get_db),
    # 暂时注释掉认证
    # current_user = Depends(get_current_user)
) -> Any:
    """
    调用MCP工具
    
    符合MCP协议的工具调用端点
    """
    # 根据名称查找工具
    tool = db.query(Tool).filter(Tool.name == request.name, Tool.status == "active").first()
    if not tool:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"工具 '{request.name}' 不存在或未激活"
        )
    
    # 调用工具
    # 暂时使用固定用户ID
    user_id = 1
    invocation = invoke_tool(
        db=db, 
        tool_id=tool.id, 
        params=request.arguments, 
        user_id=user_id
    )
    
    if not invocation:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="工具调用失败"
        )
    
    # 等待工具执行完成
    # 注意：在实际生产环境中，应该使用异步方式或WebSocket通知
    # 这里简化处理，直接返回调用ID
    
    return MCPToolCallResponse(
        content=[
            {
                "type": "text",
                "text": f"工具 '{request.name}' 调用已接受，调用ID: {invocation.invoke_id}"
            }
        ]
    )

@router.get("/tools/status/{invoke_id}")
async def get_mcp_tool_status(
    invoke_id: str,
    db: Session = Depends(get_db),
    # 暂时注释掉认证
    # current_user = Depends(get_current_user)
) -> Any:
    """
    获取MCP工具调用状态
    
    非标准MCP端点，用于查询工具调用状态
    """
    invocation = get_tool_invocation(db=db, invoke_id=invoke_id)
    if not invocation:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="调用记录不存在"
        )
    
    # 构建响应
    response = {
        "invoke_id": invocation.invoke_id,
        "status": invocation.status,
        "started_at": invocation.started_at
    }
    
    # 如果已完成，添加结果
    if invocation.status in ["success", "failed"]:
        response["finished_at"] = invocation.finished_at
        if invocation.status == "success":
            response["output"] = invocation.output
        else:
            response["error"] = invocation.error
    
    return response 