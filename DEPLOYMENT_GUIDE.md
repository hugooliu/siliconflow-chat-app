# 硅基流动AI问答应用 - 互联网部署指南

## 🚀 快速部署到互联网

### 方案一: 使用ngrok（推荐用于测试）

#### 1. 安装ngrok

**macOS:**
```bash
brew install ngrok/ngrok/ngrok
```

**Linux:**
```bash
curl -s https://ngrok-agent.s3.amazonaws.com/ngrok.asc | sudo tee /etc/apt/trusted.gpg.d/ngrok.asc >/dev/null
echo "deb https://ngrok-agent.s3.amazonaws.com buster main" | sudo tee /etc/apt/sources.list.d/ngrok.list
sudo apt update && sudo apt install ngrok
```

#### 2. 启动本地服务器

```bash
cd /Users/liuxin/Documents/trae_projects/siliconflow-chat-app
./deploy.sh
```

或者手动启动：
```bash
cd /Users/liuxin/Documents/trae_projects/siliconflow-chat-app
python3 -m http.server 8000
```

#### 3. 创建ngrok隧道

在新的终端窗口中运行：

```bash
ngrok http 8000
```

#### 4. 获取公网URL

ngrok会显示一个公网URL，类似：
```
Forwarding  https://xxxx-xx-xx-xx-xx.ngrok-free.app -> http://localhost:8000
```

这个URL就是你的应用公网地址！

#### 5. 访问应用

在浏览器中打开ngrok提供的URL，例如：
```
https://xxxx-xx-xx-xx-xx.ngrok-free.app/demo.html
```

---

### 方案二: 使用Vercel（推荐用于生产）

#### 1. 安装Vercel CLI

```bash
npm install -g vercel
```

#### 2. 创建vercel.json配置文件

在项目根目录创建 `vercel.json`:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "demo.html",
      "use": "@vercel/static"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/demo.html"
    }
  ]
}
```

#### 3. 部署到Vercel

```bash
cd /Users/liuxin/Documents/trae_projects/siliconflow-chat-app
vercel
```

按照提示操作：
- 选择 "Set up and deploy"
- 选择 "Continue with your existing account" 或创建新账户
- 选择项目名称
- 等待部署完成

#### 4. 获取公网URL

部署完成后，Vercel会提供一个URL，类似：
```
https://your-project-name.vercel.app
```

---

### 方案三: 使用Netlify（免费托管）

#### 1. 安装Netlify CLI

```bash
npm install -g netlify-cli
```

#### 2. 部署到Netlify

```bash
cd /Users/liuxin/Documents/trae_projects/siliconflow-chat-app
netlify deploy --prod
```

按照提示操作：
- 选择 "Create & configure a new site"
- 选择团队
- 输入站点名称
- 选择发布目录: `.` (当前目录)
- 等待部署完成

#### 3. 获取公网URL

Netlify会提供一个URL，类似：
```
https://your-site-name.netlify.app
```

---

### 方案四: 使用GitHub Pages（完全免费）

#### 1. 创建GitHub仓库

```bash
cd /Users/liuxin/Documents/trae_projects/siliconflow-chat-app
git init
git add demo.html
git commit -m "Initial commit"
```

在GitHub上创建新仓库，然后：

```bash
git remote add origin https://github.com/your-username/your-repo.git
git branch -M main
git push -u origin main
```

#### 2. 启用GitHub Pages

1. 打开GitHub仓库
2. 进入 "Settings" -> "Pages"
3. 在 "Source" 下选择 "Deploy from a branch"
4. 选择 "main" 分支和 "/ (root)" 目录
5. 点击 "Save"

#### 3. 获取公网URL

几分钟后，你的应用将在以下地址可用：
```
https://your-username.github.io/your-repo/demo.html
```

---

### 方案五: 使用云服务器（阿里云/腾讯云）

#### 1. 购买云服务器

推荐配置：
- CPU: 1核
- 内存: 1GB
- 带宽: 1Mbps
- 系统: Ubuntu 20.04

#### 2. 连接到服务器

```bash
ssh root@your-server-ip
```

#### 3. 安装Nginx

```bash
sudo apt update
sudo apt install -y nginx
```

#### 4. 上传文件

```bash
# 在本地电脑上
scp /Users/liuxin/Documents/trae_projects/siliconflow-chat-app/demo.html root@your-server-ip:/var/www/html/
```

#### 5. 配置Nginx

```bash
sudo nano /etc/nginx/sites-available/default
```

修改为：

```nginx
server {
    listen 80;
    server_name your-domain.com;

    root /var/www/html;
    index demo.html;

    location / {
        try_files $uri $uri/ /demo.html;
    }
}
```

重启Nginx：

```bash
sudo systemctl restart nginx
```

#### 6. 访问应用

在浏览器中打开：
```
http://your-server-ip/demo.html
```

或使用域名：
```
http://your-domain.com/demo.html
```

---

## 🎯 推荐方案对比

| 方案 | 成本 | 难度 | 稳定性 | 适用场景 |
|------|------|------|--------|---------|
| **ngrok** | 免费 | ⭐ | ⭐⭐ | 快速测试 |
| **Vercel** | 免费 | ⭐⭐ | ⭐⭐⭐⭐⭐ | 生产环境 |
| **Netlify** | 免费 | ⭐⭐ | ⭐⭐⭐⭐⭐ | 生产环境 |
| **GitHub Pages** | 免费 | ⭐⭐⭐ | ⭐⭐⭐⭐ | 个人项目 |
| **云服务器** | 付费 | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | 企业应用 |

## 📝 部署检查清单

部署前确认：

- [ ] API密钥已配置
- [ ] API URL正确 (`https://api.siliconflow.cn`)
- [ ] 模型名称正确 (`deepseek-ai/DeepSeek-V3`)
- [ ] 首页描述已修复

部署后验证：

- [ ] 可以通过公网URL访问
- [ ] 页面加载正常
- [ ] 可以选择模型
- [ ] 可以发送消息
- [ ] 可以收到AI回复

## 🔒 安全注意事项

⚠️ **重要提示**:

1. **API密钥安全**
   - 当前demo.html中API密钥是明文的
   - 任何人查看源代码都能看到密钥
   - 建议使用完整版的前后端分离架构

2. **使用限制**
   - 免费方案可能有流量限制
   - 注意监控API使用量
   - 设置合理的请求限流

3. **HTTPS**
   - 生产环境必须使用HTTPS
   - Vercel和Netlify自动提供HTTPS
   - 云服务器需要配置SSL证书

## 🚀 立即开始

### 最快的方式（5分钟内完成）

使用ngrok：

```bash
# 终端1: 启动本地服务器
cd /Users/liuxin/Documents/trae_projects/siliconflow-chat-app
python3 -m http.server 8000

# 终端2: 创建ngrok隧道
ngrok http 8000
```

复制ngrok提供的URL，加上 `/demo.html`，就可以分享了！

### 最稳定的方式（10分钟内完成）

使用Vercel：

```bash
cd /Users/liuxin/Documents/trae_projects/siliconflow-chat-app
npm install -g vercel
vercel
```

按照提示操作，几分钟后就能获得稳定的公网URL！

## 📞 获取帮助

如果遇到问题：

1. 查看本文档的故障排查部分
2. 检查部署平台的文档
3. 查看浏览器控制台的错误信息
4. 使用test-api.html进行诊断

---

**祝你部署成功！** 🎉
