from fastapi import APIRouter
from app.api.endpoints import mcp

router = APIRouter()

# 注册MCP路由
router.include_router(mcp.router, prefix="/mcp", tags=["MCP协议"]) 