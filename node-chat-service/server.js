const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const helmet = require('helmet');
const jwt = require('jsonwebtoken');
const axios = require('axios');
const winston = require('winston');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();

const app = express();
const server = http.createServer(app);

// Configure logger
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'chat-service.log' })
  ]
});

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:3000",
  credentials: true
}));
app.use(express.json());

// Socket.IO setup
const io = socketIo(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true
  }
});

// In-memory storage for sessions (use Redis in production)
const activeSessions = new Map();
const userSessions = new Map();

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    activeSessions: activeSessions.size
  });
});

// Test n8n endpoint
app.post('/api/test/n8n', async (req, res) => {
  try {
    const response = await sendToN8N({
      message: "Test message",
      sessionId: "test_session",
      userId: null,
      context: {
        platform: "mindcare",
        type: "test",
        timestamp: new Date().toISOString()
      }
    });
    res.json({ success: true, response });
  } catch (error) {
    logger.error('n8n test failed:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Socket authentication middleware
io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.userId = decoded.sub;
      socket.userRole = decoded.role;
    } catch (err) {
      logger.warn('Invalid token provided:', err.message);
    }
  }
  
  next();
});

// Socket connection handling
io.on('connection', (socket) => {
  logger.info(`User connected: ${socket.id}, userId: ${socket.userId || 'anonymous'}`);

  // Join session
  socket.on('join_session', async (data) => {
    try {
      const { sessionId, userId } = data;
      
      socket.join(sessionId);
      socket.sessionId = sessionId;
      
      // Store session info
      if (!activeSessions.has(sessionId)) {
        activeSessions.set(sessionId, {
          id: sessionId,
          userId: userId || null,
          type: 'chatbot',
          status: 'open',
          messages: [],
          startedAt: new Date(),
          socketId: socket.id
        });
      }
      
      if (userId) {
        userSessions.set(userId, sessionId);
      }
      
      logger.info(`User joined session: ${sessionId}`);
      
      // Save session to backend
      await saveSessionToBackend(sessionId, userId);
      
    } catch (error) {
      logger.error('Error joining session:', error);
      socket.emit('error', { message: 'Failed to join session' });
    }
  });

  // Handle incoming messages
  socket.on('send_message', async (data) => {
    try {
      const { sessionId, message, userId } = data;
      const session = activeSessions.get(sessionId);
      
      if (!session) {
        socket.emit('error', { message: 'Session not found' });
        return;
      }

      // Store message
      const messageObj = {
        id: uuidv4(),
        text: message,
        sender: 'user',
        timestamp: new Date().toISOString(),
        userId: userId || null
      };
      
      session.messages.push(messageObj);
      
      // Emit typing indicator
      socket.to(sessionId).emit('typing_start');
      
      // Send to n8n for AI response
      try {
        const aiResponse = await sendToN8N({
          message,
          sessionId,
          userId: userId || null,
          context: {
            platform: "mindcare",
            type: "mental_health_support",
            timestamp: new Date().toISOString(),
            messageHistory: session.messages.slice(-5) // Last 5 messages for context
          }
        });
        
        // Stop typing indicator
        socket.to(sessionId).emit('typing_stop');
        
        // Store AI response
        const aiMessageObj = {
          id: uuidv4(),
          text: aiResponse.reply || "I'm here to help. Can you tell me more about how you're feeling?",
          sender: 'bot',
          timestamp: new Date().toISOString(),
          confidence: aiResponse.confidence || 0.8,
          escalationSuggested: aiResponse.escalationSuggested || false
        };
        
        session.messages.push(aiMessageObj);
        
        // Send AI response to user
        socket.emit('bot_reply', {
          message: aiMessageObj.text,
          confidence: aiMessageObj.confidence,
          escalationSuggested: aiMessageObj.escalationSuggested,
          timestamp: aiMessageObj.timestamp
        });
        
        // Save messages to backend
        await saveMessagesToBackend(sessionId, [messageObj, aiMessageObj]);
        
      } catch (aiError) {
        logger.error('AI response error:', aiError);
        
        // Fallback response
        const fallbackResponse = {
          id: uuidv4(),
          text: "I'm here to listen and support you. While I'm having some technical difficulties, please know that your feelings are valid. Would you like to speak with a human counselor?",
          sender: 'bot',
          timestamp: new Date().toISOString(),
          escalationSuggested: true
        };
        
        session.messages.push(fallbackResponse);
        socket.to(sessionId).emit('typing_stop');
        socket.emit('bot_reply', {
          message: fallbackResponse.text,
          escalationSuggested: true,
          timestamp: fallbackResponse.timestamp
        });
      }
      
    } catch (error) {
      logger.error('Error handling message:', error);
      socket.emit('error', { message: 'Failed to process message' });
    }
  });

  // Handle escalation requests
  socket.on('request_escalation', async (data) => {
    try {
      const { sessionId, reason, userId } = data;
      const session = activeSessions.get(sessionId);
      
      if (!session) {
        socket.emit('error', { message: 'Session not found' });
        return;
      }
      
      // Update session status
      session.status = 'escalated';
      session.escalationReason = reason;
      session.type = 'human_handover';
      
      // Notify available counselors (in a real app, this would be more sophisticated)
      socket.broadcast.emit('escalation_request', {
        sessionId,
        userId,
        reason,
        timestamp: new Date().toISOString()
      });
      
      // Update backend
      await updateSessionStatus(sessionId, 'escalated', reason);
      
      logger.info(`Session escalated: ${sessionId}, reason: ${reason}`);
      
    } catch (error) {
      logger.error('Error handling escalation:', error);
      socket.emit('error', { message: 'Failed to escalate session' });
    }
  });

  // Handle counselor claiming session
  socket.on('claim_session', async (data) => {
    try {
      const { sessionId, counselorId, counselorName } = data;
      const session = activeSessions.get(sessionId);
      
      if (!session || session.status !== 'escalated') {
        socket.emit('error', { message: 'Session not available for claiming' });
        return;
      }
      
      // Update session
      session.counselorId = counselorId;
      session.counselorName = counselorName;
      
      // Notify user
      io.to(sessionId).emit('handover_accepted', {
        counselorName,
        timestamp: new Date().toISOString()
      });
      
      // Update backend
      await claimSessionInBackend(sessionId, counselorId);
      
      logger.info(`Session claimed: ${sessionId} by ${counselorName}`);
      
    } catch (error) {
      logger.error('Error claiming session:', error);
      socket.emit('error', { message: 'Failed to claim session' });
    }
  });

  // Handle session closing
  socket.on('close_session', async (data) => {
    try {
      const { sessionId, rating, feedback } = data;
      const session = activeSessions.get(sessionId);
      
      if (!session) {
        socket.emit('error', { message: 'Session not found' });
        return;
      }
      
      // Update session
      session.status = 'closed';
      session.endedAt = new Date();
      session.rating = rating;
      session.feedback = feedback;
      
      // Notify participants
      io.to(sessionId).emit('session_closed', {
        timestamp: new Date().toISOString(),
        rating,
        feedback
      });
      
      // Update backend
      await closeSessionInBackend(sessionId, rating, feedback);
      
      // Clean up
      activeSessions.delete(sessionId);
      
      logger.info(`Session closed: ${sessionId}`);
      
    } catch (error) {
      logger.error('Error closing session:', error);
      socket.emit('error', { message: 'Failed to close session' });
    }
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    logger.info(`User disconnected: ${socket.id}`);
    
    // Clean up user session mapping
    if (socket.userId) {
      userSessions.delete(socket.userId);
    }
  });
});

// Helper functions
async function sendToN8N(payload) {
  const n8nUrl = process.env.N8N_WEBHOOK_URL;
  
  if (!n8nUrl) {
    throw new Error('N8N webhook URL not configured');
  }
  
  const response = await axios.post(n8nUrl, payload, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.N8N_API_KEY || ''}`
    },
    timeout: 10000
  });
  
  return response.data;
}

async function saveSessionToBackend(sessionId, userId) {
  try {
    const backendUrl = process.env.BACKEND_API_URL;
    if (!backendUrl) return;
    
    await axios.post(`${backendUrl}/counseling/sessions`, {
      session_id: sessionId,
      user_id: userId,
      type: 'chatbot',
      status: 'open',
      started_at: new Date().toISOString()
    });
  } catch (error) {
    logger.error('Failed to save session to backend:', error.message);
  }
}

async function saveMessagesToBackend(sessionId, messages) {
  try {
    const backendUrl = process.env.BACKEND_API_URL;
    if (!backendUrl) return;
    
    await axios.put(`${backendUrl}/counseling/sessions/${sessionId}/messages`, {
      messages
    });
  } catch (error) {
    logger.error('Failed to save messages to backend:', error.message);
  }
}

async function updateSessionStatus(sessionId, status, reason = null) {
  try {
    const backendUrl = process.env.BACKEND_API_URL;
    if (!backendUrl) return;
    
    await axios.put(`${backendUrl}/counseling/sessions/${sessionId}/status`, {
      status,
      escalation_reason: reason
    });
  } catch (error) {
    logger.error('Failed to update session status:', error.message);
  }
}

async function claimSessionInBackend(sessionId, counselorId) {
  try {
    const backendUrl = process.env.BACKEND_API_URL;
    if (!backendUrl) return;
    
    await axios.post(`${backendUrl}/counseling/sessions/${sessionId}/claim`, {
      counselor_id: counselorId
    });
  } catch (error) {
    logger.error('Failed to claim session in backend:', error.message);
  }
}

async function closeSessionInBackend(sessionId, rating, feedback) {
  try {
    const backendUrl = process.env.BACKEND_API_URL;
    if (!backendUrl) return;
    
    await axios.post(`${backendUrl}/counseling/sessions/${sessionId}/close`, {
      rating,
      feedback,
      ended_at: new Date().toISOString()
    });
  } catch (error) {
    logger.error('Failed to close session in backend:', error.message);
  }
}

// Start server
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  logger.info(`Chat service running on port ${PORT}`);
  console.log(`🚀 MindCare Chat Service running on port ${PORT}`);
  console.log(`📡 Socket.IO server ready for connections`);
  console.log(`🔗 n8n webhook: ${process.env.N8N_WEBHOOK_URL || 'Not configured'}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM received, shutting down gracefully');
  server.close(() => {
    logger.info('Process terminated');
    process.exit(0);
  });
});