# MindCare Platform - Setup & Run Guide

## 🚀 Quick Start (Recommended)

### Option 1: Using Docker (Easiest)

1. **Prerequisites**
   - Install Docker Desktop
   - Install Docker Compose

2. **Clone and Setup**
   ```bash
   # Navigate to project directory
   cd /path/to/mindcare

   # Copy environment files
   cp backend-laravel/.env.example backend-laravel/.env
   cp node-chat-service/.env.example node-chat-service/.env
   cp frontend-react/.env.example frontend-react/.env
   ```

3. **Start All Services**
   ```bash
   # Build and start all containers
   docker-compose up -d --build

   # Check if all services are running
   docker-compose ps

   # Initialize database
   docker-compose exec backend php artisan migrate --seed
   ```

4. **Access the Platform**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000
   - Chat Service: http://localhost:3001

---

## 🛠️ Manual Setup (Development)

### Step 1: Backend Setup (Laravel)

1. **Navigate to backend directory**
   ```bash
   cd backend-laravel
   ```

2. **Install PHP dependencies**
   ```bash
   composer install
   ```

3. **Setup environment**
   ```bash
   # Copy environment file
   cp .env.example .env

   # Generate application key
   php artisan key:generate

   # Generate JWT secret
   php artisan jwt:secret
   ```

4. **Configure database in .env**
   ```env
   DB_CONNECTION=mysql
   DB_HOST=127.0.0.1
   DB_PORT=3306
   DB_DATABASE=mindcare
   DB_USERNAME=root
   DB_PASSWORD=your_password
   ```

5. **Create database and run migrations**
   ```bash
   # Create database (using MySQL client or phpMyAdmin)
   mysql -u root -p -e "CREATE DATABASE mindcare;"

   # Run migrations and seed data
   php artisan migrate --seed
   ```

6. **Start Laravel server**
   ```bash
   php artisan serve --port=8000
   ```

### Step 2: Chat Service Setup (Node.js)

1. **Navigate to chat service directory**
   ```bash
   cd node-chat-service
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment**
   ```bash
   # Copy environment file
   cp .env.example .env
   ```

4. **Start chat service**
   ```bash
   npm run dev
   ```

### Step 3: Frontend Setup (React)

1. **Navigate to frontend directory**
   ```bash
   cd frontend-react
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment**
   ```bash
   # Copy environment file
   cp .env.example .env
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

---

## 🔧 Environment Configuration

### Backend (.env)
```env
APP_NAME="MindCare Backend"
APP_ENV=local
APP_KEY=base64:your-generated-key
APP_DEBUG=true
APP_URL=http://localhost:8000

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=mindcare
DB_USERNAME=root
DB_PASSWORD=your_password

JWT_SECRET=your-jwt-secret
ENCRYPTION_KEY=base64:your-encryption-key

# n8n Integration (optional)
N8N_WEBHOOK_URL=https://your-n8n-instance.com/webhook/mindcare-ai
```

### Chat Service (.env)
```env
NODE_ENV=development
PORT=3001
BACKEND_API_URL=http://localhost:8000/api
JWT_SECRET=your-jwt-secret
N8N_WEBHOOK_URL=https://your-n8n-instance.com/webhook/mindcare-ai
N8N_API_KEY=your-n8n-api-key
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:8000/api
VITE_SOCKET_URL=http://localhost:3001
VITE_APP_NAME=MindCare
VITE_ENABLE_ANONYMOUS_ASSESSMENT=true
VITE_ENABLE_CHAT_FEATURE=true
```

---

## 👥 Default User Accounts

After running `php artisan migrate --seed`, these accounts will be available:

| Email | Password | Role | Access |
|-------|----------|------|--------|
| admin@mindcare.com | admin123 | Admin | Full platform access |
| staff@mindcare.com | staff123 | Staff | Content management |
| psikolog@mindcare.com | psikolog123 | Psychologist | Counseling sessions |
| user@mindcare.com | user123 | User | Regular user access |

---

## 🌐 Platform URLs

- **Homepage**: http://localhost:3000
- **Login**: http://localhost:3000/auth/login
- **Register**: http://localhost:3000/auth/register
- **Assessment**: http://localhost:3000/assessment/PHQ-9
- **Dashboard**: http://localhost:3000/dashboard
- **Admin Panel**: http://localhost:3000/admin
- **API Documentation**: http://localhost:8000/api
- **Chat Service Health**: http://localhost:3001/health

---

## 🔍 Troubleshooting

### Common Issues

#### 1. Laravel Errors
```bash
# Clear cache
php artisan cache:clear
php artisan config:clear
php artisan route:clear

# Fix permissions (Linux/Mac)
chmod -R 775 storage bootstrap/cache
```

#### 2. Database Connection Issues
- Check MySQL is running
- Verify database credentials in .env
- Ensure database exists: `CREATE DATABASE mindcare;`

#### 3. Frontend Build Issues
```bash
# Clear node modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

#### 4. Port Already in Use
```bash
# Kill process on port 8000
lsof -ti:8000 | xargs kill -9

# Or use different port
php artisan serve --port=8001
```

#### 5. CORS Issues
- Check CORS configuration in `backend-laravel/config/cors.php`
- Ensure frontend URL is in allowed origins

---

## 🧪 Testing the Platform

### 1. Test Authentication
- Register new user at http://localhost:3000/auth/register
- Login with test accounts

### 2. Test Assessments
- Go to http://localhost:3000/assessment/PHQ-9
- Complete assessment form
- Check results and recommendations

### 3. Test Admin Panel
- Login as admin@mindcare.com
- Access http://localhost:3000/admin
- Manage users, content, and view analytics

### 4. Test Chat Feature
- Login as regular user
- Access chat interface
- Send messages (will show AI integration status)

---

## 📊 API Testing

### Using curl or Postman

#### 1. Login
```bash
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@mindcare.com","password":"user123"}'
```

#### 2. Get Assessment Questions
```bash
curl -X GET "http://localhost:8000/api/assessments/questions?type=PHQ-9"
```

#### 3. Submit Assessment
```bash
curl -X POST http://localhost:8000/api/assessments \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"type":"PHQ-9","answers":[1,2,1,0,2,1,1,2,0],"consent":true}'
```

---

## 🚀 Production Deployment

### Using Docker Compose
```bash
# Production build
docker-compose -f docker-compose.prod.yml up -d --build

# With SSL (recommended)
# Configure nginx with SSL certificates
# Update environment variables for production domains
```

### Manual Deployment
1. Set `APP_ENV=production` in backend .env
2. Set `NODE_ENV=production` in chat service .env
3. Build frontend: `npm run build`
4. Configure web server (nginx/apache)
5. Setup SSL certificates
6. Configure database with production credentials

---

## 📈 Monitoring

### Health Check Endpoints
- Backend: `GET http://localhost:8000/api/health`
- Chat Service: `GET http://localhost:3001/health`
- Frontend: `GET http://localhost:3000` (loads React app)

### Logs
- Laravel: `storage/logs/laravel.log`
- Chat Service: Console output or configure Winston logging
- Frontend: Browser console for client-side issues

---

## 🔒 Security Notes

1. **Change default passwords** before production
2. **Generate strong JWT secrets** for all services
3. **Enable HTTPS** in production
4. **Configure proper CORS** settings
5. **Set up database backups**
6. **Monitor logs** for security incidents
7. **Keep dependencies updated**

---

## 📞 Support

If you encounter issues:
1. Check this guide first
2. Review error logs
3. Ensure all services are running
4. Verify environment configuration
5. Check database connectivity

The platform is designed to be production-ready with proper security, scalability, and comprehensive features for mental health support services.