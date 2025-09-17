#!/bin/bash

# MindCare Platform - Development Startup Script
# This script starts all services for local development

echo "🚀 Starting MindCare Platform..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to check if port is in use
check_port() {
    if lsof -Pi :$1 -sTCP:LISTEN -t >/dev/null ; then
        echo -e "${RED}Port $1 is already in use${NC}"
        return 1
    else
        return 0
    fi
}

# Function to start backend
start_backend() {
    echo -e "${BLUE}Starting Laravel Backend...${NC}"
    cd backend-laravel
    
    # Check if .env exists
    if [ ! -f .env ]; then
        echo -e "${YELLOW}Creating .env file...${NC}"
        cp .env.example .env
    fi
    
    # Install dependencies if needed
    if [ ! -d vendor ]; then
        echo -e "${YELLOW}Installing Composer dependencies...${NC}"
        composer install
    fi
    
    # Generate keys if needed
    if ! grep -q "APP_KEY=base64:" .env; then
        echo -e "${YELLOW}Generating application key...${NC}"
        php artisan key:generate
    fi
    
    if ! grep -q "JWT_SECRET=" .env; then
        echo -e "${YELLOW}Generating JWT secret...${NC}"
        php artisan jwt:secret
    fi
    
    # Check database connection and migrate
    echo -e "${YELLOW}Running database migrations...${NC}"
    php artisan migrate --seed
    
    # Start server
    if check_port 8000; then
        echo -e "${GREEN}Starting Laravel server on port 8000...${NC}"
        php artisan serve --port=8000 &
        BACKEND_PID=$!
        echo "Backend PID: $BACKEND_PID"
    fi
    
    cd ..
}

# Function to start chat service
start_chat_service() {
    echo -e "${BLUE}Starting Chat Service...${NC}"
    cd node-chat-service
    
    # Check if .env exists
    if [ ! -f .env ]; then
        echo -e "${YELLOW}Creating .env file...${NC}"
        cp .env.example .env
    fi
    
    # Install dependencies if needed
    if [ ! -d node_modules ]; then
        echo -e "${YELLOW}Installing npm dependencies...${NC}"
        npm install
    fi
    
    # Start service
    if check_port 3001; then
        echo -e "${GREEN}Starting Chat Service on port 3001...${NC}"
        npm run dev &
        CHAT_PID=$!
        echo "Chat Service PID: $CHAT_PID"
    fi
    
    cd ..
}

# Function to start frontend
start_frontend() {
    echo -e "${BLUE}Starting React Frontend...${NC}"
    cd frontend-react
    
    # Check if .env exists
    if [ ! -f .env ]; then
        echo -e "${YELLOW}Creating .env file...${NC}"
        cp .env.example .env
    fi
    
    # Install dependencies if needed
    if [ ! -d node_modules ]; then
        echo -e "${YELLOW}Installing npm dependencies...${NC}"
        npm install
    fi
    
    # Start development server
    if check_port 3000; then
        echo -e "${GREEN}Starting React development server on port 3000...${NC}"
        npm run dev &
        FRONTEND_PID=$!
        echo "Frontend PID: $FRONTEND_PID"
    fi
    
    cd ..
}

# Function to cleanup on exit
cleanup() {
    echo -e "\n${YELLOW}Shutting down services...${NC}"
    if [ ! -z "$BACKEND_PID" ]; then
        kill $BACKEND_PID 2>/dev/null
        echo -e "${RED}Backend stopped${NC}"
    fi
    if [ ! -z "$CHAT_PID" ]; then
        kill $CHAT_PID 2>/dev/null
        echo -e "${RED}Chat Service stopped${NC}"
    fi
    if [ ! -z "$FRONTEND_PID" ]; then
        kill $FRONTEND_PID 2>/dev/null
        echo -e "${RED}Frontend stopped${NC}"
    fi
    exit 0
}

# Trap Ctrl+C
trap cleanup INT

# Main execution
echo -e "${GREEN}=== MindCare Platform Development Setup ===${NC}"
echo -e "${BLUE}This script will start all three services:${NC}"
echo -e "  - Laravel Backend (port 8000)"
echo -e "  - Node.js Chat Service (port 3001)"
echo -e "  - React Frontend (port 3000)"
echo ""

# Start services
start_backend
sleep 3
start_chat_service
sleep 3
start_frontend

echo ""
echo -e "${GREEN}=== All Services Started! ===${NC}"
echo -e "${BLUE}Access the platform at:${NC}"
echo -e "  🌐 Frontend: ${GREEN}http://localhost:3000${NC}"
echo -e "  🔧 Backend API: ${GREEN}http://localhost:8000${NC}"
echo -e "  💬 Chat Service: ${GREEN}http://localhost:3001${NC}"
echo ""
echo -e "${BLUE}Default Login Accounts:${NC}"
echo -e "  👑 Admin: admin@mindcare.com / admin123"
echo -e "  👨‍💼 Staff: staff@mindcare.com / staff123"
echo -e "  👨‍⚕️ Psychologist: psikolog@mindcare.com / psikolog123"
echo -e "  👤 User: user@mindcare.com / user123"
echo ""
echo -e "${YELLOW}Press Ctrl+C to stop all services${NC}"

# Wait for user to stop
wait