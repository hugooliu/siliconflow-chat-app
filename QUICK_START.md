# 快速部署指南

## 方案一: Docker部署(推荐)

### 前置要求
- Docker 20.10+
- Docker Compose 2.0+

### 部署步骤

1. **确保API密钥已配置**
   
   检查 `.env` 文件中的API密钥是否正确:
   ```bash
   cat .env
   ```

2. **启动服务**
   
   ```bash
   cd siliconflow-chat-app
   docker-compose up -d
   ```

3. **查看服务状态**
   
   ```bash
   docker-compose ps
   ```

4. **查看日志**
   
   ```bash
   # 查看所有服务日志
   docker-compose logs -f
   
   # 查看后端日志
   docker-compose logs -f backend
   
   # 查看前端日志
   docker-compose logs -f frontend
   ```

5. **访问应用**
   
   打开浏览器访问: `http://localhost`

6. **停止服务**
   
   ```bash
   docker-compose down
   ```

### 常用命令

```bash
# 重启服务
docker-compose restart

# 重新构建并启动
docker-compose up -d --build

# 查看资源使用情况
docker stats

# 进入后端容器
docker-compose exec backend sh

# 进入前端容器
docker-compose exec frontend sh
```

## 方案二: 本地Node.js部署

### 前置要求
- Node.js 18+
- npm 9+

### 部署步骤

1. **安装Node.js**
   
   macOS:
   ```bash
   brew install node
   ```
   
   Linux:
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs
   ```

2. **使用启动脚本**
   
   ```bash
   cd siliconflow-chat-app
   ./start.sh
   ```

3. **手动启动**
   
   ```bash
   # 启动后端
   cd backend
   npm install
   npm run dev
   
   # 新终端启动前端
   cd frontend
   npm install
   npm run dev
   ```

4. **访问应用**
   
   打开浏览器访问: `http://localhost:3000`

## 方案三: 云服务器部署

### 阿里云/腾讯云部署

1. **购买服务器**
   - 配置: 2核4GB
   - 系统: Ubuntu 20.04

2. **连接服务器**
   ```bash
   ssh root@your-server-ip
   ```

3. **安装Docker**
   ```bash
   curl -fsSL https://get.docker.com | sh
   sudo usermod -aG docker $USER
   ```

4. **上传代码**
   ```bash
   git clone <your-repo-url>
   cd siliconflow-chat-app
   ```

5. **配置环境变量**
   ```bash
   nano .env
   # 填入你的API密钥
   ```

6. **启动服务**
   ```bash
   docker-compose up -d
   ```

7. **配置域名解析**
   - 在云服务商DNS管理中添加A记录
   - 指向服务器IP

8. **配置HTTPS(可选)**
   ```bash
   sudo apt-get install -y certbot
   sudo certbot certonly --standalone -d your-domain.com
   ```

## 验证部署

### 1. 检查后端健康状态

```bash
curl http://localhost:5000/api/health
```

预期响应:
```json
{
  "status": "ok",
  "timestamp": "2026-01-15T10:00:00.000Z",
  "uptime": 123.456
}
```

### 2. 测试API调用

```bash
curl -X POST http://localhost:5000/api/chat/completions \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [{"role": "user", "content": "你好"}],
    "model": "deepseek-chat"
  }'
```

### 3. 检查前端访问

打开浏览器访问应用,尝试发送一条消息。

## 故障排查

### Docker相关问题

**问题: 端口被占用**
```bash
# 查看端口占用
lsof -i :80
lsof -i :5000

# 修改docker-compose.yml中的端口映射
```

**问题: 容器无法启动**
```bash
# 查看详细日志
docker-compose logs backend
docker-compose logs frontend

# 重新构建
docker-compose down
docker-compose up -d --build
```

**问题: API调用失败**
```bash
# 检查环境变量
docker-compose exec backend env | grep API_KEY

# 测试网络连接
docker-compose exec backend ping api.siliconflow.com
```

### Node.js相关问题

**问题: 依赖安装失败**
```bash
# 清除缓存
npm cache clean --force

# 删除node_modules重新安装
rm -rf node_modules package-lock.json
npm install
```

**问题: 端口被占用**
```bash
# 查找占用端口的进程
lsof -i :3000
lsof -i :5000

# 杀死进程
kill -9 <PID>
```

## 性能优化

### 1. 启用缓存

在 `docker-compose.yml` 中添加:
```yaml
services:
  backend:
    # ... 其他配置
    volumes:
      - ./cache:/app/cache
```

### 2. 调整资源限制

```yaml
services:
  backend:
    deploy:
      resources:
        limits:
          cpus: '2'
          memory: 2G
        reservations:
          cpus: '1'
          memory: 1G
```

### 3. 使用CDN

将前端静态文件部署到CDN,提高访问速度。

## 监控和日志

### 查看实时日志

```bash
# Docker
docker-compose logs -f

# Node.js + PM2
pm2 logs
```

### 设置日志轮转

创建 `/etc/logrotate.d/siliconflow-chat`:
```
/path/to/logs/*.log {
    daily
    rotate 7
    compress
    delaycompress
    missingok
    notifempty
}
```

## 安全建议

1. **定期更新依赖**
   ```bash
   cd backend && npm update
   cd frontend && npm update
   ```

2. **使用HTTPS**
   - 配置SSL证书
   - 强制HTTPS重定向

3. **限制访问**
   - 配置防火墙规则
   - 使用IP白名单

4. **定期备份**
   - 备份环境变量
   - 备份配置文件

## 联系支持

如遇到问题:
1. 查看本文档的故障排查部分
2. 检查应用日志
3. 提交Issue获取帮助
