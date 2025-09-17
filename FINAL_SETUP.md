# MindCare Platform - Final Setup Guide

## 🚀 Complete Setup Instructions

### Prerequisites
- PHP 8.2+
- Composer
- Node.js 18+
- MySQL 8.0+
- Git

### Step 1: Backend Setup (Laravel)
```bash
cd backend-laravel

# Install dependencies
composer install

# Setup environment
cp .env.example .env

# Generate keys
php artisan key:generate
php artisan jwt:secret

# Setup database (create 'mindcare' database first)
php artisan migrate --seed

# Start server
php artisan serve --port=8000
```

### Step 2: Chat Service Setup
```bash
cd node-chat-service

# Install dependencies
npm install

# Setup environment
cp .env.example .env

# Start service
npm run dev
```

### Step 3: Frontend Setup
```bash
cd frontend-react

# Install dependencies
npm install

# Setup environment
cp .env.example .env

# Start development server
npm run dev
```

## 🌐 Access URLs
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **Chat Service**: http://localhost:3001

## 👥 Default Accounts
- **Admin**: admin@mindcare.com / admin123
- **Staff**: staff@mindcare.com / staff123
- **Psychologist**: psikolog@mindcare.com / psikolog123
- **User**: user@mindcare.com / user123

## ✅ Features Available
- ✅ User Authentication & Registration
- ✅ Mental Health Assessments (PHQ-9, GAD-7, DASS-21)
- ✅ User Dashboard with Statistics
- ✅ Content Management (Articles, Videos, Quizzes)
- ✅ Blog System
- ✅ Community Links (Discord/Telegram)
- ✅ Real-time Chat with AI Bot
- ✅ Admin Panel with Analytics
- ✅ Mobile Responsive Design
- ✅ Role-based Access Control

## 🔧 Troubleshooting

### Laravel Issues
```bash
# Clear cache
php artisan cache:clear
php artisan config:clear
php artisan route:clear

# Fix permissions
chmod -R 775 storage bootstrap/cache
```

### Database Issues
```bash
# Create database
mysql -u root -p -e "CREATE DATABASE mindcare;"

# Reset migrations
php artisan migrate:fresh --seed
```

### Frontend Issues
```bash
# Clear node modules
rm -rf node_modules package-lock.json
npm install
```

## 🐳 Docker Setup (Alternative)
```bash
# Start all services with Docker
docker-compose up -d --build

# Initialize database
docker-compose exec backend php artisan migrate --seed
```

## 📱 Testing the Platform

1. **Register/Login**: Create account or use default accounts
2. **Take Assessment**: Go to /assessment/PHQ-9
3. **View Dashboard**: Check your assessment history
4. **Browse Content**: Explore articles and videos
5. **Use Chat**: Test the AI chatbot feature
6. **Admin Panel**: Login as admin to manage platform

The platform is now fully functional and production-ready!