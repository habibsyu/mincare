import express from 'express';
import { createServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import winston from 'winston';
import { RateLimiterMemory } from 'rate-limiter-flexible';
import { v4 as uuidv4 } from 'uuid';

import { ChatService } from './src/services/ChatService.js';
import { N8nService } from './src/services/N8nService.js';
import { BackendApiService } from './src/services/BackendApiService.js';
import { SocketAuthMiddleware } from './src/middleware/SocketAuthMiddleware.js';
import { setupRoutes } from './src/routes/index.js';

dotenv.config();

// Initialize Express app
const app = express();
const server = createServer(app);

// Configure logger
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'logs/chat-service.log' })
  ]
});

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000', 'http://localhost:5173'],
  methods: ['GET', 'POST'],
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));

// Rate limiting
const rateLimiter = new RateLimiterMemory({
  keyGenerator: (req) => req.ip,
  points: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  duration: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 60000,
});

// Apply rate limiting middleware
app.use(async (req, res, next) => {
  try {
    await rateLimiter.consume(req.ip);
    next();
  } catch (rejRes) {
    res.status(429).json({
      error: 'Too Many Requests',
      retryAfter: Math.round(rejRes.msBeforeNext / 1000) || 1,
    });
  }
});

// Initialize services
const backendApiService = new BackendApiService(process.env.BACKEND_API_URL, logger);
const n8nService = new N8nService(process.env.N8N_WEBHOOK_URL, process.env.N8N_API_KEY, logger);
const chatService = new ChatService(backendApiService, n8nService, logger);

// Setup Socket.IO
const io = new SocketIOServer(server, {
  cors: {
    origin: process.env.SOCKET_IO_CORS_ORIGIN || '*',
    methods: process.env.SOCKET_IO_CORS_METHODS?.split(',') || ['GET', 'POST']
  },
  pingTimeout: 60000,
  pingInterval: 25000
});

// Socket authentication middleware
const socketAuth = new SocketAuthMiddleware(process.env.JWT_SECRET, logger);
io.use(socketAuth.authenticate.bind(socketAuth));

// Socket.IO connection handling
io.on('connection', (socket) => {
  logger.info(`User connected: ${socket.userId}`, { socketId: socket.id, userId: socket.userId });

  // Join user to their personal room
  socket.join(`user_${socket.userId}`);

  // Handle joining chat sessions
  socket.on('join_session', async (data) => {
    try {
      const { sessionId, consent } = data;

      if (!consent) {
        socket.emit('error', { message: 'Consent required for counseling session' });
        return;
      }

      const session = await chatService.joinSession(socket.userId, sessionId);
      
      socket.join(sessionId);
      socket.currentSession = sessionId;
      
      socket.emit('session_joined', {
        sessionId,
        messages: session.messages || [],
        sessionType: session.session_type
      });

      logger.info(`User ${socket.userId} joined session ${sessionId}`);
    } catch (error) {
      logger.error('Error joining session:', error);
      socket.emit('error', { message: 'Failed to join session' });
    }
  });

  // Handle new chat messages
  socket.on('send_message', async (data) => {
    try {
      const { sessionId, message, metadata = {} } = data;

      if (!sessionId || !message?.trim()) {
        socket.emit('error', { message: 'Invalid message data' });
        return;
      }

      // Rate limit messages per user
      const messageKey = `messages:${socket.userId}`;
      try {
        await rateLimiter.consume(messageKey);
      } catch (rejRes) {
        socket.emit('error', { 
          message: 'Message rate limit exceeded', 
          retryAfter: Math.round(rejRes.msBeforeNext / 1000) 
        });
        return;
      }

      const messageData = {
        id: uuidv4(),
        message: message.trim(),
        sender: 'user',
        timestamp: new Date().toISOString(),
        metadata
      };

      // Save message to session
      await chatService.addMessage(sessionId, messageData);

      // Broadcast to session room
      io.to(sessionId).emit('message_received', messageData);

      // Get AI response if it's a chatbot session
      const session = await backendApiService.getCounselingSession(sessionId);
      
      if (session?.session_type === 'chatbot') {
        try {
          const aiResponse = await chatService.getAIResponse(message, sessionId, socket.userId);
          
          const botMessage = {
            id: uuidv4(),
            message: aiResponse.message,
            sender: 'bot',
            timestamp: new Date().toISOString(),
            metadata: {
              confidence: aiResponse.confidence,
              intent: aiResponse.intent,
              escalationSuggested: aiResponse.escalationSuggested
            }
          };

          await chatService.addMessage(sessionId, botMessage);
          io.to(sessionId).emit('message_received', botMessage);

          // Handle escalation suggestion
          if (aiResponse.escalationSuggested) {
            socket.emit('escalation_suggested', {
              reason: aiResponse.escalationReason,
              sessionId
            });
          }

        } catch (aiError) {
          logger.error('AI response error:', aiError);
          
          // Send fallback message
          const fallbackMessage = {
            id: uuidv4(),
            message: "I'm sorry, I'm having trouble processing your request right now. Would you like to speak with a human counselor?",
            sender: 'bot',
            timestamp: new Date().toISOString(),
            metadata: { fallback: true }
          };

          await chatService.addMessage(sessionId, fallbackMessage);
          io.to(sessionId).emit('message_received', fallbackMessage);
        }
      }

    } catch (error) {
      logger.error('Error handling message:', error);
      socket.emit('error', { message: 'Failed to send message' });
    }
  });

  // Handle escalation requests
  socket.on('request_escalation', async (data) => {
    try {
      const { sessionId, reason } = data;

      const result = await chatService.escalateToHuman(sessionId, reason, socket.userId);

      socket.emit('escalation_requested', {
        sessionId,
        ticketId: result.ticketId,
        message: 'Your request has been escalated to our support team. A counselor will join the conversation shortly.'
      });

      // Notify available staff
      io.to('staff_room').emit('escalation_alert', {
        sessionId,
        userId: socket.userId,
        reason,
        timestamp: new Date().toISOString()
      });

      logger.info(`Session ${sessionId} escalated by user ${socket.userId}`, { reason });

    } catch (error) {
      logger.error('Escalation error:', error);
      socket.emit('error', { message: 'Failed to escalate session' });
    }
  });

  // Handle staff joining sessions
  socket.on('staff_join_session', async (data) => {
    try {
      const { sessionId } = data;

      // Verify staff role
      if (!socket.userRole || !['admin', 'staff', 'psikolog'].includes(socket.userRole)) {
        socket.emit('error', { message: 'Insufficient permissions' });
        return;
      }

      const session = await chatService.assignStaffToSession(sessionId, socket.userId);
      
      socket.join(sessionId);
      socket.currentSession = sessionId;

      // Join staff room for notifications
      socket.join('staff_room');

      socket.emit('session_joined', {
        sessionId,
        messages: session.messages || [],
        sessionType: session.session_type,
        userInfo: session.user
      });

      // Notify user that staff joined
      io.to(sessionId).emit('staff_joined', {
        staffName: socket.userName,
        message: 'A counselor has joined the conversation.'
      });

      logger.info(`Staff ${socket.userId} joined session ${sessionId}`);

    } catch (error) {
      logger.error('Error staff joining session:', error);
      socket.emit('error', { message: 'Failed to join session as staff' });
    }
  });

  // Handle disconnection
  socket.on('disconnect', (reason) => {
    logger.info(`User disconnected: ${socket.userId}`, { 
      socketId: socket.id, 
      userId: socket.userId, 
      reason,
      session: socket.currentSession 
    });

    if (socket.currentSession) {
      io.to(socket.currentSession).emit('user_disconnected', {
        userId: socket.userId,
        timestamp: new Date().toISOString()
      });
    }
  });

  // Error handling
  socket.on('error', (error) => {
    logger.error('Socket error:', error);
  });
});

// Setup API routes
setupRoutes(app, chatService, logger);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    version: process.env.npm_package_version || '1.0.0'
  });
});

// Error handling middleware
app.use((error, req, res, next) => {
  logger.error('Unhandled error:', error);
  res.status(500).json({
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
  });
});

// Start server
const PORT = process.env.PORT || 3001;

server.listen(PORT, () => {
  logger.info(`MindCare Chat Service running on port ${PORT}`, {
    nodeEnv: process.env.NODE_ENV,
    port: PORT
  });
});

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('Received SIGTERM, shutting down gracefully');
  server.close(() => {
    logger.info('Server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  logger.info('Received SIGINT, shutting down gracefully');
  server.close(() => {
    logger.info('Server closed');
    process.exit(0);
  });
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

export default server;