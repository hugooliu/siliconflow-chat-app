# 部署指南

本文档提供硅基流动AI问答应用的详细部署说明。

## 目录

- [开发环境部署](#开发环境部署)
- [生产环境部署](#生产环境部署)
- [Docker部署](#docker部署)
- [云服务部署](#云服务部署)
- [性能监控](#性能监控)
- [安全加固](#安全加固)

## 开发环境部署

### 1. 环境准备

确保已安装以下软件:
- Node.js 18.0 或更高版本
- npm 9.0 或更高版本
- Git

### 2. 克隆项目

```bash
git clone <repository-url>
cd siliconflow-chat-app
```

### 3. 安装依赖

```bash
# 安装后端依赖
cd backend
npm install

# 安装前端依赖
cd ../frontend
npm install
```

### 4. 配置环境变量

```bash
cd backend
cp .env.example .env
```

编辑 `.env` 文件:

```env
PORT=5000
SILICONFLOW_API_KEY=sk-xxxxxxxxxxxxxxxxxxxxxxxx
SILICONFLOW_API_URL=https://api.siliconflow.com/v1
NODE_ENV=development
```

### 5. 启动服务

**启动后端:**

```bash
cd backend
npm run dev
```

**启动前端(新终端):**

```bash
cd frontend
npm run dev
```

### 6. 访问应用

打开浏览器访问: `http://localhost:3000`

## 生产环境部署

### 1. 服务器准备

推荐配置:
- CPU: 2核或以上
- 内存: 4GB或以上
- 磁盘: 20GB或以上
- 操作系统: Ubuntu 20.04+ / CentOS 7+

### 2. 安装Node.js

```bash
# 使用NodeSource仓库安装Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# 验证安装
node --version
npm --version
```

### 3. 安装PM2进程管理器

```bash
sudo npm install -g pm2
```

### 4. 部署应用

```bash
# 克隆代码
git clone <repository-url>
cd siliconflow-chat-app

# 安装依赖
cd backend && npm install
cd ../frontend && npm install

# 构建前端
npm run build

# 构建后端
cd ../backend
npm run build
```

### 5. 配置生产环境变量

```bash
cd backend
cp .env.example .env
nano .env
```

生产环境配置:

```env
PORT=5000
SILICONFLOW_API_KEY=sk-xxxxxxxxxxxxxxxxxxxxxxxx
SILICONFLOW_API_URL=https://api.siliconflow.com/v1
NODE_ENV=production
FRONTEND_URL=https://your-domain.com
```

### 6. 使用PM2启动服务

```bash
# 启动后端
pm2 start dist/index.js --name siliconflow-backend

# 查看状态
pm2 status

# 查看日志
pm2 logs siliconflow-backend

# 设置开机自启
pm2 startup
pm2 save
```

### 7. 配置Nginx反向代理

安装Nginx:

```bash
sudo apt-get update
sudo apt-get install -y nginx
```

创建配置文件:

```bash
sudo nano /etc/nginx/sites-available/siliconflow-chat
```

配置内容:

```nginx
server {
    listen 80;
    server_name your-domain.com;

    # 前端静态文件
    location / {
        root /path/to/siliconflow-chat-app/frontend/dist;
        try_files $uri $uri/ /index.html;
    }

    # API代理
    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # 启用gzip压缩
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/json;
}
```

启用配置:

```bash
sudo ln -s /etc/nginx/sites-available/siliconflow-chat /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### 8. 配置HTTPS(使用Let's Encrypt)

```bash
# 安装Certbot
sudo apt-get install -y certbot python3-certbot-nginx

# 获取SSL证书
sudo certbot --nginx -d your-domain.com

# 自动续期
sudo certbot renew --dry-run
```

## Docker部署

### 1. 创建Dockerfile

**后端Dockerfile:**

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 5000

CMD ["node", "dist/index.js"]
```

**前端Dockerfile:**

```dockerfile
FROM node:18-alpine as builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

### 2. 创建docker-compose.yml

```yaml
version: '3.8'

services:
  backend:
    build: ./backend
    container_name: siliconflow-backend
    ports:
      - "5000:5000"
    environment:
      - PORT=5000
      - SILICONFLOW_API_KEY=${SILICONFLOW_API_KEY}
      - NODE_ENV=production
    restart: unless-stopped
    networks:
      - app-network

  frontend:
    build: ./frontend
    container_name: siliconflow-frontend
    ports:
      - "80:80"
    depends_on:
      - backend
    restart: unless-stopped
    networks:
      - app-network

networks:
  app-network:
    driver: bridge
```

### 3. 启动服务

```bash
# 构建并启动
docker-compose up -d

# 查看日志
docker-compose logs -f

# 停止服务
docker-compose down
```

## 云服务部署

### 阿里云部署

1. **购买ECS实例**
   - 选择Ubuntu 20.04
   - 配置: 2核4GB
   - 带宽: 5Mbps

2. **配置安全组**
   - 开放端口: 80, 443, 22

3. **部署应用**
   - 按照生产环境部署步骤操作

4. **配置域名解析**
   - 在阿里云DNS添加A记录

### 腾讯云部署

1. **购买CVM实例**
   - 选择Ubuntu 20.04
   - 配置: 2核4GB
   - 带宽: 5Mbps

2. **配置安全组**
   - 开放端口: 80, 443, 22

3. **部署应用**
   - 按照生产环境部署步骤操作

4. **配置域名解析**
   - 在腾讯云DNS添加A记录

## 性能监控

### 1. PM2监控

```bash
# 实时监控
pm2 monit

# 查看详细信息
pm2 show siliconflow-backend

# 查看日志
pm2 logs siliconflow-backend --lines 100
```

### 2. Nginx日志

```bash
# 访问日志
sudo tail -f /var/log/nginx/access.log

# 错误日志
sudo tail -f /var/log/nginx/error.log
```

### 3. 应用日志

```bash
# PM2日志
pm2 logs siliconflow-backend

# 查看错误日志
pm2 logs siliconflow-backend --err
```

## 安全加固

### 1. 防火墙配置

```bash
# 安装UFW
sudo apt-get install -y ufw

# 配置防火墙
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow ssh
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
```

### 2. 限制API访问

在Nginx配置中添加IP白名单:

```nginx
location /api {
    allow 1.2.3.4;  # 允许的IP
    deny all;
    proxy_pass http://localhost:5000;
    # ... 其他配置
}
```

### 3. 定期更新

```bash
# 更新系统
sudo apt-get update && sudo apt-get upgrade -y

# 更新Node.js依赖
cd /path/to/siliconflow-chat-app/backend
npm update

cd ../frontend
npm update
```

### 4. 备份策略

```bash
# 创建备份脚本
cat > /opt/backup.sh << 'EOF'
#!/bin/bash
BACKUP_DIR="/opt/backups"
DATE=$(date +%Y%m%d_%H%M%S)
mkdir -p $BACKUP_DIR

# 备份代码
tar -czf $BACKUP_DIR/code_$DATE.tar.gz /path/to/siliconflow-chat-app

# 备份环境变量
cp /path/to/siliconflow-chat-app/backend/.env $BACKUP_DIR/env_$DATE

# 删除30天前的备份
find $BACKUP_DIR -type f -mtime +30 -delete
EOF

chmod +x /opt/backup.sh

# 添加定时任务
crontab -e
# 添加: 0 2 * * * /opt/backup.sh
```

## 故障排查

### 常见问题

1. **服务无法启动**
   ```bash
   # 检查端口占用
   sudo netstat -tlnp | grep :5000

   # 检查PM2状态
   pm2 status

   # 查看详细日志
   pm2 logs siliconflow-backend --lines 50
   ```

2. **API调用失败**
   ```bash
   # 检查环境变量
   cat /path/to/backend/.env

   # 测试API连接
   curl -X POST http://localhost:5000/api/health
   ```

3. **前端无法访问**
   ```bash
   # 检查Nginx配置
   sudo nginx -t

   # 重启Nginx
   sudo systemctl restart nginx

   # 检查文件权限
   ls -la /path/to/frontend/dist
   ```

## 维护建议

1. **定期检查日志**
   - 每天查看错误日志
   - 监控API调用成功率

2. **性能优化**
   - 定期清理日志文件
   - 监控服务器资源使用
   - 根据负载调整配置

3. **安全更新**
   - 及时更新系统补丁
   - 定期更新依赖包
   - 检查安全漏洞

4. **数据备份**
   - 每日自动备份
   - 定期测试恢复流程
   - 异地备份重要数据

## 联系支持

如遇到部署问题,请:
1. 查看本文档的故障排查部分
2. 检查应用日志
3. 提交Issue或联系技术支持
