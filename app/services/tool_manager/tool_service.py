from typing import Dict, List, Any, Optional
import uuid
from datetime import datetime
from sqlalchemy.orm import Session
import httpx
import json
import asyncio
from fastapi import HTTPException, status

from app.schemas.tool import ToolCreate, ToolResponse, ToolInvocationResponse
from app.models.tool import Tool, ToolInvocation
from app.services.tool_manager.example_tools import (
    mock_weather_api, 
    mock_document_summary, 
    mock_database_query,
    get_example_tools
)

def register_tool(db: Session, tool_in: ToolCreate) -> Tool:
    """
    注册新工具到系统
    """
    # 检查工具名称是否已存在
    existing_tool = db.query(Tool).filter(Tool.name == tool_in.name).first()
    if existing_tool:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="工具名称已存在"
        )
    
    # 创建新工具记录
    db_tool = Tool(
        name=tool_in.name,
        type=tool_in.type,
        endpoint=tool_in.endpoint,
        description=tool_in.description,
        auth_type=tool_in.auth_type,
        auth_info=tool_in.auth_info,
        required_role=tool_in.required_role,
        input_schema=tool_in.input_schema,
        capabilities=tool_in.capabilities,
        status="active"  # 默认为激活状态
    )
    
    db.add(db_tool)
    db.commit()
    db.refresh(db_tool)
    return db_tool

def register_example_tools(db: Session) -> List[Tool]:
    """
    注册示例工具到系统
    """
    example_tools = get_example_tools()
    registered_tools = []
    
    for tool_data in example_tools:
        # 检查工具是否已存在
        existing_tool = db.query(Tool).filter(Tool.name == tool_data["name"]).first()
        if existing_tool:
            registered_tools.append(existing_tool)
            continue
        
        # 创建工具
        tool = Tool(
            name=tool_data["name"],
            type=tool_data["type"],
            endpoint=tool_data["endpoint"],
            description=tool_data["description"],
            auth_type=tool_data["auth_type"],
            auth_info=tool_data.get("auth_info"),
            input_schema=tool_data["input_schema"],
            capabilities=tool_data.get("capabilities"),
            status="active"
        )
        
        db.add(tool)
        registered_tools.append(tool)
    
    db.commit()
    for tool in registered_tools:
        db.refresh(tool)
    
    return registered_tools

def get_tools(db: Session, skip: int = 0, limit: int = 100, status: Optional[str] = None) -> List[Tool]:
    """
    获取工具列表，可按状态筛选
    """
    query = db.query(Tool)
    if status:
        query = query.filter(Tool.status == status)
    
    return query.offset(skip).limit(limit).all()

def get_tool_by_id(db: Session, tool_id: int) -> Optional[Tool]:
    """
    根据ID获取工具
    """
    return db.query(Tool).filter(Tool.id == tool_id).first()

async def _call_api_tool(endpoint: str, params: Dict[str, Any], auth_info: Dict[str, Any] = None) -> Dict[str, Any]:
    """
    调用API类型的工具
    """
    # 检查是否为示例工具，使用模拟响应
    if "api.example.com/weather" in endpoint:
        return mock_weather_api(
            city=params.get("city", "北京"),
            date=params.get("date")
        )
    elif "api.example.com/summarize" in endpoint:
        return mock_document_summary(
            text=params.get("text", ""),
            max_length=params.get("max_length", 200)
        )
    
    # 真实API调用
    headers = {}
    if auth_info:
        if auth_info.get("type") == "bearer":
            headers["Authorization"] = f"Bearer {auth_info.get('token')}"
        elif auth_info.get("type") == "apikey":
            headers[auth_info.get("header", "X-API-Key")] = auth_info.get("key")
    
    try:
        async with httpx.AsyncClient() as client:
            response = await client.post(
                endpoint,
                json=params,
                headers=headers,
                timeout=30.0
            )
            response.raise_for_status()
            return response.json()
    except httpx.HTTPError as e:
        return {"error": f"HTTP错误: {str(e)}"}
    except Exception as e:
        return {"error": f"调用API错误: {str(e)}"}

def invoke_tool(db: Session, tool_id: int, params: Dict[str, Any], user_id: int) -> ToolInvocationResponse:
    """
    调用工具并记录调用
    """
    # 获取工具信息
    tool = get_tool_by_id(db, tool_id)
    if not tool or tool.status != "active":
        return None
    
    # 创建调用记录
    invoke_id = str(uuid.uuid4())
    now = datetime.now()
    
    invocation = ToolInvocation(
        invoke_id=invoke_id,
        tool_id=tool_id,
        user_id=user_id,
        params=params,
        status="running",
        started_at=now
    )
    
    db.add(invocation)
    db.commit()
    db.refresh(invocation)
    
    # 异步调用工具
    asyncio.create_task(_process_tool_invocation(db, tool, invocation))
    
    # 返回初始状态
    return ToolInvocationResponse(
        invoke_id=invoke_id,
        tool_id=tool_id,
        status="running",
        started_at=now
    )

async def _process_tool_invocation(db: Session, tool: Tool, invocation: ToolInvocation):
    """
    异步处理工具调用
    """
    result = None
    error = None
    
    try:
        if tool.type == "api":
            # 调用API类型工具
            result = await _call_api_tool(tool.endpoint, invocation.params, tool.auth_info)
        elif tool.type == "script":
            # 处理脚本类型工具
            if "db_query.py" in tool.endpoint:
                # 模拟数据库查询
                result = mock_database_query(
                    query=invocation.params.get("query", ""),
                    database=invocation.params.get("database", "")
                )
            else:
                # 其他脚本类型工具
                result = {"message": "脚本执行功能尚未实现"}
                error = "不支持的工具类型"
        else:
            error = f"不支持的工具类型: {tool.type}"
    except Exception as e:
        error = str(e)
    
    # 更新调用记录
    invocation.status = "success" if not error else "failed"
    invocation.output = result
    invocation.error = error
    invocation.finished_at = datetime.now()
    
    db.add(invocation)
    db.commit()

def get_tool_invocation(db: Session, invoke_id: str) -> Optional[ToolInvocation]:
    """
    获取工具调用状态
    """
    return db.query(ToolInvocation).filter(ToolInvocation.invoke_id == invoke_id).first() 