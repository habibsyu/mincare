# MindCare Mental Health Platform

A comprehensive, production-ready mental health platform built with React, Laravel, and Node.js, featuring AI-powered chat support, professional assessments, and admin management tools.

## 🏗️ Architecture Overview

This platform consists of three main services:

### 1. Frontend (React + Vite)
- **Location**: `frontend-react/`
- **Port**: 3000 (dev) / 80 (production)
- **Technology**: React 18, Vite, Tailwind CSS, Socket.IO Client
- **Features**: Responsive UI, Real-time chat, Assessment forms, Admin dashboard

### 2. Backend API (Laravel 11)
- **Location**: `backend-laravel/`
- **Port**: 8000
- **Technology**: PHP 8.2, Laravel 11, MySQL, JWT Authentication
- **Features**: REST API, User management, Content management, Assessment processing

### 3. Chat Service (Node.js + Socket.IO)
- **Location**: `node-chat-service/`
- **Port**: 3001
- **Technology**: Node.js, Express, Socket.IO, n8n Integration
- **Features**: Real-time messaging, AI chatbot integration, Session management

## 🚀 Quick Start

### Prerequisites
- Docker & Docker Compose
- Node.js 18+ (for local development)
- PHP 8.2+ (for local development)
- MySQL 8.0+

### 1. Clone and Setup
```bash
# Clone the repository
git clone <repository-url>
cd mindcare-platform

# Copy environment files
cp backend-laravel/.env.example backend-laravel/.env
cp node-chat-service/.env.example node-chat-service/.env
cp frontend-react/.env.example frontend-react/.env
```

### 2. Configure Environment Variables

#### Backend (.env)
```env
APP_NAME="MindCare Backend"
APP_ENV=production
APP_KEY=base64:your-app-key-here
APP_DEBUG=false
APP_URL=http://localhost:8000

DB_CONNECTION=mysql
DB_HOST=mysql
DB_PORT=3306
DB_DATABASE=mindcare
DB_USERNAME=mindcare
DB_PASSWORD=mindcare123

JWT_SECRET=your-jwt-secret-key
ENCRYPTION_KEY=base64:your-encryption-key-here
N8N_WEBHOOK_URL=https://your-n8n-instance.com/webhook/mindcare-ai
```

#### Chat Service (.env)
```env
NODE_ENV=production
PORT=3001
BACKEND_API_URL=http://backend:8000/api
JWT_SECRET=your-jwt-secret-key
N8N_WEBHOOK_URL=https://your-n8n-instance.com/webhook/mindcare-ai
N8N_API_KEY=your-n8n-api-key
```

#### Frontend (.env)
```env
VITE_API_URL=http://localhost:8000/api
VITE_SOCKET_URL=http://localhost:3001
VITE_APP_NAME=MindCare
VITE_ENABLE_ANONYMOUS_ASSESSMENT=true
VITE_ENABLE_CHAT_FEATURE=true
```

### 3. Start with Docker Compose
```bash
# Build and start all services
docker-compose up -d --build

# Check service status
docker-compose ps

# View logs
docker-compose logs -f
```

### 4. Initialize Database
```bash
# Run migrations and seed database
docker-compose exec backend php artisan migrate --seed

# Generate application key
docker-compose exec backend php artisan key:generate

# Generate JWT secret
docker-compose exec backend php artisan jwt:secret
```

## 🔧 Manual Development Setup

### Backend Setup
```bash
cd backend-laravel

# Install dependencies
composer install

# Setup environment
cp .env.example .env
php artisan key:generate
php artisan jwt:secret

# Run migrations
php artisan migrate --seed

# Start development server
php artisan serve --port=8000
```

### Chat Service Setup
```bash
cd node-chat-service

# Install dependencies
npm install

# Start development server
npm run dev
```

### Frontend Setup
```bash
cd frontend-react

# Install dependencies
npm install

# Start development server
npm run dev
```

## 📊 Database Schema

### Key Tables
- **users**: User accounts with role-based access (admin/staff/user/psikolog)
- **assessments**: Mental health assessments (PHQ-9, GAD-7, DASS-21)
- **contents**: Educational articles, videos, quizzes
- **blogs**: Blog posts and articles
- **counseling_sessions**: Chat sessions and message history
- **community_links**: Discord/Telegram community links

### Default Users
After seeding, these accounts will be available:

| Email | Password | Role |
|-------|----------|------|
| admin@mindcare.com | admin123 | Admin |
| staff@mindcare.com | staff123 | Staff |
| psikolog@mindcare.com | psikolog123 | Psychologist |
| user@mindcare.com | user123 | User |

## 🔒 Security Features

### Authentication & Authorization
- JWT-based authentication
- Role-based access control (RBAC)
- Password hashing with bcrypt
- Session management

### Data Protection
- Encrypted assessment data at rest
- Input validation and sanitization
- CSRF protection
- Rate limiting on sensitive endpoints

### Privacy Compliance
- Consent tracking for assessments and counseling
- Data anonymization options
- Secure session management

## 🤖 AI Integration (n8n)

### Setup n8n Workflow
1. Install n8n: `npm install -g n8n`
2. Start n8n: `n8n start`
3. Create webhook endpoint for MindCare
4. Configure AI workflow for mental health responses
5. Update webhook URL in environment variables

### Webhook Payload Format
```json
{
  "message": "User message text",
  "sessionId": "session_abc123",
  "userId": 123,
  "context": {
    "platform": "mindcare",
    "type": "mental_health_support",
    "timestamp": "2024-01-01T00:00:00Z"
  }
}
```

### Expected Response Format
```json
{
  "reply": "AI response message",
  "confidence": 0.8,
  "intent": "support_request",
  "escalationSuggested": false,
  "escalationReason": null
}
```

## 🌐 API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user

### Assessment Endpoints
- `GET /api/assessments/questions?type=PHQ-9` - Get assessment questions
- `POST /api/assessments` - Submit assessment
- `GET /api/assessments/{id}` - Get assessment result

### Content Endpoints
- `GET /api/contents` - List published content
- `GET /api/contents/{id}` - Get content detail
- `POST /api/contents` - Create content (staff/admin)

### Chat Endpoints (Socket.IO)
- `join_session` - Join counseling session
- `send_message` - Send chat message
- `request_escalation` - Escalate to human counselor

## 📱 Frontend Features

### Public Pages
- **Home**: Hero section, featured content, testimonials
- **Assessment**: PHQ-9, GAD-7, DASS-21 questionnaires
- **Content**: Educational articles and videos
- **Blog**: Mental health articles and tips
- **Community**: Discord/Telegram links

### Protected Pages
- **Dashboard**: Personal assessment history, recommendations
- **Profile**: User profile management
- **Chat**: Real-time counseling chat interface

### Admin Panel
- **Users**: User management and roles
- **Content**: Article/video content management
- **Assessments**: Assessment results and analytics
- **Sessions**: Counseling session monitoring

## 🎨 UI/UX Features

### Design System
- Consistent color palette (primary, secondary, success, warning, error)
- Responsive grid system
- Accessible form components
- Smooth animations and transitions

### Accessibility
- WCAG 2.1 AA compliance
- Semantic HTML structure
- Keyboard navigation support
- Screen reader compatibility
- High contrast mode support

### Performance
- Code splitting and lazy loading
- Image optimization
- Service worker caching
- Optimized bundle sizes

## 🔧 Deployment

### Production Deployment
```bash
# Build for production
docker-compose -f docker-compose.prod.yml up -d --build

# SSL Setup (recommended)
# Configure nginx with SSL certificates
# Update CORS settings for production domains
```

### Environment Configuration
- Update all `.env` files with production values
- Configure proper database credentials
- Set secure JWT secrets
- Configure n8n webhook URLs
- Enable proper error logging

### Health Checks
- Backend: `GET /api/health`
- Chat Service: `GET /health`
- Frontend: `GET /` (loads React app)

## 📈 Monitoring & Analytics

### Logging
- Structured logging with Winston (Node.js)
- Laravel logging for API requests
- Error tracking and monitoring

### Metrics
- User registration and activity
- Assessment completion rates
- Chat session analytics
- Content engagement metrics

## 🧪 Testing

### Backend Testing
```bash
cd backend-laravel
php artisan test
```

### Frontend Testing
```bash
cd frontend-react
npm run test
```

### Chat Service Testing
```bash
cd node-chat-service
npm run test
```

## 🛠️ Troubleshooting

### Common Issues

#### Database Connection Issues
```bash
# Check MySQL container status
docker-compose ps mysql

# View MySQL logs
docker-compose logs mysql

# Recreate database container
docker-compose down mysql
docker-compose up -d mysql
```

#### Chat Service Connection Issues
```bash
# Check Socket.IO connection
# Browser console: io("http://localhost:3001")

# Verify n8n webhook
curl -X POST http://localhost:3001/api/test/n8n
```

#### Frontend Build Issues
```bash
# Clear node_modules and reinstall
cd frontend-react
rm -rf node_modules package-lock.json
npm install
```

### Performance Optimization
- Enable Redis for session storage
- Configure CDN for static assets
- Implement database query optimization
- Add proper caching headers

## 🤝 Contributing

### Development Workflow
1. Create feature branch
2. Implement changes with tests
3. Update documentation
4. Submit pull request

### Code Style
- PSR-12 for PHP (Laravel)
- ESLint + Prettier for JavaScript/React
- Consistent naming conventions

## 📄 License

This project is licensed under the MIT License. See LICENSE file for details.

## 📞 Support

For technical support or questions:
- Create GitHub issue
- Email: dev@mindcare.com
- Documentation: https://docs.mindcare.com

---

## ⚠️ Important Security Notes

1. **Change default passwords** before deploying to production
2. **Generate strong JWT secrets** for all services  
3. **Enable HTTPS** in production environments
4. **Configure proper CORS** settings
5. **Implement backup strategy** for database
6. **Monitor logs** for security incidents
7. **Keep dependencies updated** for security patches

This platform is designed for production use with proper security measures, scalability considerations, and comprehensive feature set for mental health support services.