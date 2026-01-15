#!/bin/bash

echo "正在停止服务..."

# 读取PID并停止服务
if [ -f ".backend.pid" ]; then
    BACKEND_PID=$(cat .backend.pid)
    kill $BACKEND_PID 2>/dev/null
    rm -f .backend.pid
    echo "✓ 后端服务已停止"
fi

if [ -f ".frontend.pid" ]; then
    FRONTEND_PID=$(cat .frontend.pid)
    kill $FRONTEND_PID 2>/dev/null
    rm -f .frontend.pid
    echo "✓ 前端服务已停止"
fi

# 清理可能残留的进程
pkill -f "tsx watch src/index.ts" 2>/dev/null
pkill -f "vite" 2>/dev/null

echo "所有服务已停止"
