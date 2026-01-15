#!/bin/bash

echo "==================================="
echo "硅基流动AI问答应用 - 部署脚本"
echo "==================================="

# 检查Python3是否安装
if ! command -v python3 &> /dev/null; then
    echo "错误: 未检测到Python3"
    exit 1
fi

echo "✓ Python3版本: $(python3 --version)"

# 进入项目目录
cd "$(dirname "$0")"

# 启动HTTP服务器
echo ""
echo "==================================="
echo "启动HTTP服务器"
echo "==================================="
echo ""
echo "服务器将在 http://localhost:8000 启动"
echo "按 Ctrl+C 停止服务器"
echo ""

python3 -m http.server 8000
