# 硅基流动AI问答应用

基于硅基流动(SiliconFlow)API的大模型问答Web应用,提供用户友好的聊天界面,支持实时对话、会话管理和智能回答。

## 功能特性

- 实时AI对话: 基于DeepSeek大模型的智能问答
- 会话管理: 支持新建对话、历史记录
- 响应式设计: 完美适配桌面和移动设备
- 状态指示: 实时显示API调用状态和错误信息
- 安全机制: 请求限流、输入验证、XSS防护
- 错误处理: 完善的错误提示和日志记录

## 技术架构

### 前端
- React 18 + TypeScript
- Vite 构建工具
- Axios HTTP客户端
- Tailwind CSS样式

### 后端
- Node.js + Express
- TypeScript
- 请求限流(express-rate-limit)
- 输入验证(express-validator)
- 硅基流动API集成

## 快速开始

### 前置要求

- Node.js 18+
- npm 或 yarn
- 硅基流动API密钥

### 获取API密钥

1. 访问 [硅基流动官网](https://cloud.siliconflow.cn)
2. 注册账号并完成实名认证
3. 在个人中心创建API密钥
4. 复制API密钥备用

### 安装依赖

#### 后端安装

```bash
cd backend
npm install
```

#### 前端安装

```bash
cd frontend
npm install
```

### 配置环境变量

1. 复制后端环境变量示例文件:

```bash
cd backend
cp .env.example .env
```

2. 编辑 `.env` 文件,填入你的API密钥:

```env
PORT=5000
SILICONFLOW_API_KEY=你的API密钥
SILICONFLOW_API_URL=https://api.siliconflow.com/v1
NODE_ENV=development
```

### 启动应用

#### 启动后端服务

```bash
cd backend
npm run dev
```

后端服务将在 `http://localhost:5000` 启动

#### 启动前端服务

打开新终端窗口:

```bash
cd frontend
npm run dev
```

前端服务将在 `http://localhost:3000` 启动

### 访问应用

在浏览器中打开 `http://localhost:3000` 即可开始使用

## API文档

### 健康检查

```
GET /api/health
```

响应示例:
```json
{
  "status": "ok",
  "timestamp": "2026-01-15T10:00:00.000Z",
  "uptime": 123.456
}
```

### 聊天完成

```
POST /api/chat/completions
```

请求体:
```json
{
  "messages": [
    {
      "role": "user",
      "content": "你好,请介绍一下自己"
    }
  ],
  "model": "deepseek-chat",
  "stream": false
}
```

响应示例:
```json
{
  "success": true,
  "data": {
    "id": "chatcmpl-xxx",
    "choices": [
      {
        "message": {
          "role": "assistant",
          "content": "你好!我是基于DeepSeek大模型的AI助手..."
        }
      }
    ],
    "usage": {
      "prompt_tokens": 10,
      "completion_tokens": 50,
      "total_tokens": 60
    }
  },
  "timestamp": "2026-01-15T10:00:00.000Z"
}
```

### 获取可用模型

```
GET /api/chat/models
```

响应示例:
```json
[
  "deepseek-chat",
  "deepseek-coder",
  "Qwen/Qwen2.5-7B-Instruct"
]
```

## 安全特性

### 请求限流
- 每个IP每分钟最多20次请求
- 超过限制返回429状态码

### 输入验证
- 消息内容长度限制: 2000字符
- 自动过滤HTML标签和脚本
- 验证消息角色和格式

### API密钥保护
- API密钥存储在后端环境变量
- 前端无法直接访问密钥
- 所有请求通过后端代理

## 部署指南

### 生产环境配置

1. 设置环境变量:

```env
PORT=5000
SILICONFLOW_API_KEY=你的生产环境API密钥
SILICONFLOW_API_URL=https://api.siliconflow.com/v1
NODE_ENV=production
FRONTEND_URL=https://你的域名.com
```

2. 构建前端:

```bash
cd frontend
npm run build
```

3. 构建后端:

```bash
cd backend
npm run build
```

4. 启动服务:

```bash
cd backend
npm start
```

### Docker部署

创建 `docker-compose.yml`:

```yaml
version: '3.8'

services:
  backend:
    build: ./backend
    ports:
      - "5000:5000"
    environment:
      - PORT=5000
      - SILICONFLOW_API_KEY=${SILICONFLOW_API_KEY}
      - NODE_ENV=production
    restart: unless-stopped

  frontend:
    build: ./frontend
    ports:
      - "80:80"
    depends_on:
      - backend
    restart: unless-stopped
```

启动服务:

```bash
docker-compose up -d
```

### Nginx配置

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

## 性能优化

- 响应时间: 平均 < 3秒
- 并发处理: 支持多用户同时使用
- 缓存策略: 可选的响应缓存
- 连接池: 复用HTTP连接

## 故障排查

### 后端无法启动

1. 检查端口是否被占用
2. 确认API密钥配置正确
3. 查看日志输出

### 前端无法连接后端

1. 确认后端服务正常运行
2. 检查CORS配置
3. 验证API代理设置

### API调用失败

1. 检查API密钥是否有效
2. 确认网络连接正常
3. 查看后端日志获取详细错误信息

## 项目结构

```
siliconflow-chat-app/
├── frontend/                 # 前端项目
│   ├── src/
│   │   ├── components/      # React组件
│   │   ├── contexts/        # 状态管理
│   │   ├── services/        # API服务
│   │   ├── types/           # TypeScript类型
│   │   ├── App.tsx          # 主应用组件
│   │   └── main.tsx         # 入口文件
│   ├── package.json
│   └── vite.config.ts
├── backend/                  # 后端项目
│   ├── src/
│   │   ├── middleware/      # 中间件
│   │   ├── routes/          # 路由
│   │   ├── services/        # 业务逻辑
│   │   ├── utils/           # 工具函数
│   │   └── index.ts         # 入口文件
│   ├── package.json
│   └── .env.example
└── README.md
```

## 许可证

MIT License

## 贡献

欢迎提交Issue和Pull Request!

## 联系方式

如有问题,请通过以下方式联系:
- 提交Issue
- 发送邮件

## 更新日志

### v1.0.0 (2026-01-15)
- 初始版本发布
- 支持基础聊天功能
- 实现会话管理
- 添加安全机制
