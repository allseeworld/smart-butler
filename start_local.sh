#!/bin/bash

# 颜色定义
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}李府管家系统 - 本地开发环境启动脚本${NC}"
echo "======================================"

# 检查Python是否安装
if ! command -v python3 &> /dev/null; then
    echo "错误: 未找到Python3，请先安装Python3"
    exit 1
fi

# 检查Node.js是否安装
if ! command -v node &> /dev/null; then
    echo "错误: 未找到Node.js，请先安装Node.js"
    exit 1
fi

# 检查npm是否安装
if ! command -v npm &> /dev/null; then
    echo "错误: 未找到npm，请先安装npm"
    exit 1
fi

# 创建Python虚拟环境（如果不存在）
if [ ! -d "venv" ]; then
    echo -e "${GREEN}创建Python虚拟环境...${NC}"
    python3 -m venv venv
fi

# 激活虚拟环境
echo -e "${GREEN}激活Python虚拟环境...${NC}"
source venv/bin/activate

# 安装后端依赖
echo -e "${GREEN}安装后端依赖...${NC}"
cd backend
pip install -r requirements.txt
cd ..

# 安装前端依赖
echo -e "${GREEN}安装前端依赖...${NC}"
cd frontend
npm install
cd ..

# 启动后端（后台运行）
echo -e "${GREEN}启动后端服务...${NC}"
cd backend
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload &
BACKEND_PID=$!
cd ..

# 启动前端（后台运行）
echo -e "${GREEN}启动前端服务...${NC}"
cd frontend
npm run dev &
FRONTEND_PID=$!
cd ..

echo "======================================"
echo -e "${GREEN}服务已启动:${NC}"
echo "后端API: http://localhost:8000"
echo "前端应用: http://localhost:3000"
echo "======================================"
echo "按 Ctrl+C 停止所有服务"

# 捕获SIGINT信号（Ctrl+C）
trap "kill $BACKEND_PID $FRONTEND_PID; exit" SIGINT

# 等待用户中断
wait 