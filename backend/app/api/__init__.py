from fastapi import APIRouter
from app.api.endpoints import router as endpoints_router

router = APIRouter()

# 注册endpoints路由
router.include_router(endpoints_router) 