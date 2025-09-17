@echo off
REM MindCare Platform - Development Startup Script for Windows
REM This script starts all services for local development

echo 🚀 Starting MindCare Platform...

REM Function to check if port is in use
:check_port
netstat -an | find ":%1 " | find "LISTENING" >nul
if %errorlevel% == 0 (
    echo Port %1 is already in use
    exit /b 1
) else (
    exit /b 0
)

REM Start Backend
echo Starting Laravel Backend...
cd backend-laravel

REM Check if .env exists
if not exist .env (
    echo Creating .env file...
    copy .env.example .env
)

REM Install dependencies if needed
if not exist vendor (
    echo Installing Composer dependencies...
    composer install
)

REM Generate keys if needed
findstr /C:"APP_KEY=base64:" .env >nul
if %errorlevel% neq 0 (
    echo Generating application key...
    php artisan key:generate
)

findstr /C:"JWT_SECRET=" .env >nul
if %errorlevel% neq 0 (
    echo Generating JWT secret...
    php artisan jwt:secret
)

REM Run migrations
echo Running database migrations...
php artisan migrate --seed

REM Start Laravel server
call :check_port 8000
if %errorlevel% == 0 (
    echo Starting Laravel server on port 8000...
    start "Laravel Backend" php artisan serve --port=8000
)

cd ..

REM Start Chat Service
echo Starting Chat Service...
cd node-chat-service

REM Check if .env exists
if not exist .env (
    echo Creating .env file...
    copy .env.example .env
)

REM Install dependencies if needed
if not exist node_modules (
    echo Installing npm dependencies...
    npm install
)

REM Start chat service
call :check_port 3001
if %errorlevel% == 0 (
    echo Starting Chat Service on port 3001...
    start "Chat Service" npm run dev
)

cd ..

REM Start Frontend
echo Starting React Frontend...
cd frontend-react

REM Check if .env exists
if not exist .env (
    echo Creating .env file...
    copy .env.example .env
)

REM Install dependencies if needed
if not exist node_modules (
    echo Installing npm dependencies...
    npm install
)

REM Start frontend
call :check_port 3000
if %errorlevel% == 0 (
    echo Starting React development server on port 3000...
    start "React Frontend" npm run dev
)

cd ..

echo.
echo === All Services Started! ===
echo Access the platform at:
echo   🌐 Frontend: http://localhost:3000
echo   🔧 Backend API: http://localhost:8000
echo   💬 Chat Service: http://localhost:3001
echo.
echo Default Login Accounts:
echo   👑 Admin: admin@mindcare.com / admin123
echo   👨‍💼 Staff: staff@mindcare.com / staff123
echo   👨‍⚕️ Psychologist: psikolog@mindcare.com / psikolog123
echo   👤 User: user@mindcare.com / user123
echo.
echo Press any key to exit...
pause >nul