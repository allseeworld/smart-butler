# 李府管家系统

李府管家系统是一个综合性的家庭管理系统，用于管理家庭任务、工具、知识库和标准操作流程(SOP)。

## 系统要求

- Python 3.8+
- Node.js 16+
- npm 8+
- PostgreSQL (可选，如果使用本地数据库)
- Nginx (可选，用于本地代理)

## 本地开发环境设置

### 方法一：使用启动脚本（推荐）

1. 克隆仓库：
   ```bash
   git clone <repository-url>
   cd lifu-butler-system
   ```

2. 运行启动脚本：
   ```bash
   ./start_local.sh
   ```

   这将自动设置Python虚拟环境，安装所有依赖，并启动前端和后端服务。

3. 访问应用：
   - 前端：http://localhost:3000
   - 后端API：http://localhost:8000

### 方法二：手动设置

1. 设置后端：
   ```bash
   cd backend
   python -m venv venv
   source venv/bin/activate  # Windows上使用: venv\Scripts\activate
   pip install -r requirements.txt
   python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
   ```

2. 设置前端：
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

### 方法三：使用Nginx进行本地代理

1. 安装Nginx（如果尚未安装）：
   ```bash
   # Ubuntu/Debian
   sudo apt update
   sudo apt install nginx

   # CentOS/RHEL
   sudo yum install epel-release
   sudo yum install nginx

   # macOS
   brew install nginx
   ```

2. 复制Nginx配置：
   ```bash
   sudo cp nginx_local.conf /etc/nginx/conf.d/lifu-butler.conf
   # 或者在macOS上：
   sudo cp nginx_local.conf /usr/local/etc/nginx/servers/lifu-butler.conf
   ```

3. 重启Nginx：
   ```bash
   # Ubuntu/Debian/CentOS
   sudo systemctl restart nginx

   # macOS
   sudo brew services restart nginx
   ```

4. 启动前端和后端服务（使用启动脚本或手动启动）。

5. 访问应用：
   - 通过Nginx：http://localhost
   - 直接访问前端：http://localhost:3000
   - 直接访问后端API：http://localhost:8000

## 项目结构

```
lifu-butler-system/
├── backend/                # 后端代码
│   ├── app/                # 应用代码
│   │   ├── api/            # API路由
│   │   ├── core/           # 核心功能
│   │   ├── db/             # 数据库相关
│   │   ├── models/         # 数据库模型
│   │   └── schemas/        # Pydantic模式
│   ├── alembic/            # 数据库迁移
│   └── requirements.txt    # 依赖列表
├── frontend/               # 前端代码
│   ├── public/             # 静态资源
│   ├── src/                # 源代码
│   │   ├── assets/         # 资源文件
│   │   ├── components/     # 组件
│   │   ├── context/        # 上下文
│   │   ├── hooks/          # 自定义钩子
│   │   ├── pages/          # 页面
│   │   ├── services/       # 服务
│   │   └── utils/          # 工具函数
│   ├── package.json        # 依赖列表
│   └── tsconfig.json       # TypeScript配置
├── nginx/                  # Nginx配置
└── docker-compose.yml      # Docker Compose配置
```

## 功能模块

- **用户认证**：登录、注册、权限管理
- **任务管理**：创建、分配、跟踪家庭任务
- **工具管理**：家庭工具的登记、借用和归还
- **知识库**：家庭相关知识的存储和检索
- **SOP管理**：标准操作流程的创建和执行

## 贡献指南

1. Fork仓库
2. 创建功能分支 (`git checkout -b feature/amazing-feature`)
3. 提交更改 (`git commit -m 'Add some amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 创建Pull Request
