#!/bin/bash

echo "==================================="
echo "硅基流动AI问答应用 - 快速启动脚本"
echo "==================================="

# 检查Node.js是否安装
if ! command -v node &> /dev/null; then
    echo "错误: 未检测到Node.js,请先安装Node.js 18或更高版本"
    echo "访问 https://nodejs.org 下载安装"
    exit 1
fi

echo "✓ Node.js版本: $(node --version)"

# 检查npm是否安装
if ! command -v npm &> /dev/null; then
    echo "错误: 未检测到npm"
    exit 1
fi

echo "✓ npm版本: $(npm --version)"

# 检查后端环境变量
if [ ! -f "backend/.env" ]; then
    echo ""
    echo "==================================="
    echo "配置后端环境变量"
    echo "==================================="
    echo ""
    read -p "请输入硅基流动API密钥: " api_key
    
    if [ -z "$api_key" ]; then
        echo "错误: API密钥不能为空"
        exit 1
    fi
    
    cp backend/.env.example backend/.env
    sed -i.bak "s/your_api_key_here/$api_key/" backend/.env
    rm backend/.env.bak
    
    echo "✓ 环境变量配置完成"
else
    echo "✓ 检测到环境变量文件: backend/.env"
fi

# 安装后端依赖
echo ""
echo "==================================="
echo "安装后端依赖"
echo "==================================="
cd backend
if [ ! -d "node_modules" ]; then
    npm install
    echo "✓ 后端依赖安装完成"
else
    echo "✓ 后端依赖已存在"
fi
cd ..

# 安装前端依赖
echo ""
echo "==================================="
echo "安装前端依赖"
echo "==================================="
cd frontend
if [ ! -d "node_modules" ]; then
    npm install
    echo "✓ 前端依赖安装完成"
else
    echo "✓ 前端依赖已存在"
fi
cd ..

# 启动服务
echo ""
echo "==================================="
echo "启动服务"
echo "==================================="
echo ""

# 启动后端
echo "正在启动后端服务..."
cd backend
npm run dev > ../backend.log 2>&1 &
BACKEND_PID=$!
echo "✓ 后端服务已启动 (PID: $BACKEND_PID)"
cd ..

# 等待后端启动
echo "等待后端服务启动..."
sleep 3

# 检查后端是否启动成功
if curl -s http://localhost:5000/api/health > /dev/null; then
    echo "✓ 后端服务运行正常"
else
    echo "✗ 后端服务启动失败,请查看日志: backend.log"
    exit 1
fi

# 启动前端
echo ""
echo "正在启动前端服务..."
cd frontend
npm run dev > ../frontend.log 2>&1 &
FRONTEND_PID=$!
echo "✓ 前端服务已启动 (PID: $FRONTEND_PID)"
cd ..

echo ""
echo "==================================="
echo "启动完成!"
echo "==================================="
echo ""
echo "后端服务: http://localhost:5000"
echo "前端服务: http://localhost:3000"
echo ""
echo "日志文件:"
echo "  - 后端日志: backend.log"
echo "  - 前端日志: frontend.log"
echo ""
echo "按 Ctrl+C 停止所有服务"
echo ""

# 保存PID
echo $BACKEND_PID > .backend.pid
echo $FRONTEND_PID > .frontend.pid

# 等待用户中断
trap "echo ''; echo '正在停止服务...'; kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; rm -f .backend.pid .frontend.pid; echo '服务已停止'; exit 0" INT TERM

while true; do
    sleep 1
done
