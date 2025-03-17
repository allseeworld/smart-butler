from fastapi import APIRouter

from app.api.endpoints import auth, tasks, tools, knowledge, sop, users, mcp

router = APIRouter()

router.include_router(auth.router, prefix="/auth", tags=["认证"])
router.include_router(tasks.router, prefix="/tasks", tags=["任务管理"])
router.include_router(tools.router, prefix="/tools", tags=["工具管理"])
router.include_router(knowledge.router, prefix="/knowledge", tags=["知识管理"])
router.include_router(sop.router, prefix="/sop", tags=["SOP管理"])
router.include_router(users.router, prefix="/users", tags=["用户管理"])
router.include_router(mcp.router, prefix="/mcp", tags=["MCP协议"]) 