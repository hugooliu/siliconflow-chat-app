#!/bin/bash

echo "==================================="
echo "硅基流动AI问答应用 - GitHub Pages部署"
echo "==================================="

# 检查git是否安装
if ! command -v git &> /dev/null; then
    echo "错误: 未检测到git"
    echo "请先安装git: brew install git"
    exit 1
fi

echo "✓ Git版本: $(git --version)"

# 进入项目目录
cd "$(dirname "$0")"

# 初始化git仓库（如果还没有）
if [ ! -d ".git" ]; then
    echo ""
    echo "初始化Git仓库..."
    git init
    git add demo.html
    git commit -m "Initial commit: SiliconFlow Chat App"
    echo "✓ Git仓库已初始化"
else
    echo "✓ Git仓库已存在"
fi

echo ""
echo "==================================="
echo "下一步操作"
echo "==================================="
echo ""
echo "1. 在GitHub上创建一个新仓库"
echo "   访问: https://github.com/new"
echo ""
echo "2. 添加远程仓库（替换YOUR_USERNAME和YOUR_REPO）"
echo "   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git"
echo ""
echo "3. 推送到GitHub"
echo "   git branch -M main"
echo "   git push -u origin main"
echo ""
echo "4. 在GitHub仓库中启用GitHub Pages"
echo "   - 进入仓库的 Settings -> Pages"
echo "   - 在 Source 下选择 'Deploy from a branch'"
echo "   - 选择 'main' 分支和 '/ (root)' 目录"
echo "   - 点击 Save"
echo ""
echo "5. 等待几分钟后，你的应用将在以下地址可用："
echo "   https://YOUR_USERNAME.github.io/YOUR_REPO/demo.html"
echo ""
echo "==================================="
echo "详细说明请查看: DEPLOYMENT_GUIDE.md"
echo "==================================="
