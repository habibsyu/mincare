export class ChatService {
  constructor(backendApiService, n8nService, logger) {
    this.backendApi = backendApiService;
    this.n8nService = n8nService;
    this.logger = logger;
  }

  async joinSession(userId, sessionId) {
    try {
      // Get or create session
      let session = await this.backendApi.getCounselingSession(sessionId);

      if (!session) {
        // Create new session
        session = await this.backendApi.createCounselingSession({
          userId,
          sessionId,
          sessionType: 'chatbot',
          consentGivenAt: new Date().toISOString()
        });

        this.logger.info(`Created new session: ${sessionId} for user: ${userId}`);
      }

      return session;
    } catch (error) {
      this.logger.error('Error in joinSession:', error);
      throw error;
    }
  }

  async addMessage(sessionId, messageData) {
    try {
      await this.backendApi.addMessageToSession(sessionId, messageData);
      this.logger.debug(`Message added to session ${sessionId}:`, messageData);
    } catch (error) {
      this.logger.error('Error adding message:', error);
      throw error;
    }
  }

  async getAIResponse(message, sessionId, userId) {
    try {
      this.logger.debug(`Getting AI response for message: "${message}"`);

      const response = await this.n8nService.sendToAI({
        message,
        sessionId,
        userId,
        context: {
          platform: 'mindcare',
          type: 'mental_health_support',
          timestamp: new Date().toISOString()
        }
      });

      // Process n8n response
      const aiResponse = {
        message: response.reply || "I understand you're reaching out for support. How are you feeling right now?",
        confidence: response.confidence || 0.8,
        intent: response.intent || 'support_request',
        escalationSuggested: response.escalationSuggested || false,
        escalationReason: response.escalationReason || null,
        metadata: {
          n8nWorkflowId: response.workflowId,
          processingTime: response.processingTime
        }
      };

      // Apply escalation logic
      this.evaluateEscalation(message, aiResponse);

      return aiResponse;
    } catch (error) {
      this.logger.error('Error getting AI response:', error);
      
      // Return fallback response
      return {
        message: "I'm here to help. Can you tell me more about what's on your mind?",
        confidence: 0.5,
        intent: 'fallback',
        escalationSuggested: false,
        metadata: { fallback: true }
      };
    }
  }

  evaluateEscalation(message, aiResponse) {
    const escalationKeywords = [
      'suicide', 'kill myself', 'end it all', 'not worth living',
      'self-harm', 'cut myself', 'hurt myself',
      'emergency', 'crisis', 'urgent help needed'
    ];

    const messageText = message.toLowerCase();
    const hasEscalationKeyword = escalationKeywords.some(keyword => 
      messageText.includes(keyword)
    );

    if (hasEscalationKeyword || aiResponse.confidence < 0.6) {
      aiResponse.escalationSuggested = true;
      aiResponse.escalationReason = hasEscalationKeyword ? 
        'Crisis keywords detected' : 
        'Low confidence response';
    }
  }

  async escalateToHuman(sessionId, reason, userId) {
    try {
      const ticketId = `ESC_${Date.now()}_${sessionId}`;

      // Update session status
      await this.backendApi.escalateSession(sessionId, {
        reason,
        escalatedBy: userId,
        ticketId
      });

      // Create escalation notification
      await this.backendApi.createEscalationNotification({
        sessionId,
        userId,
        reason,
        ticketId,
        priority: this.getEscalationPriority(reason)
      });

      this.logger.info(`Session ${sessionId} escalated with ticket ${ticketId}`);

      return { ticketId, message: 'Escalated successfully' };
    } catch (error) {
      this.logger.error('Error escalating session:', error);
      throw error;
    }
  }

  getEscalationPriority(reason) {
    const highPriorityKeywords = ['suicide', 'crisis', 'emergency', 'urgent'];
    const reasonText = reason?.toLowerCase() || '';
    
    return highPriorityKeywords.some(keyword => 
      reasonText.includes(keyword)
    ) ? 'high' : 'normal';
  }

  async assignStaffToSession(sessionId, staffId) {
    try {
      const session = await this.backendApi.assignStaffToSession(sessionId, staffId);
      
      this.logger.info(`Staff ${staffId} assigned to session ${sessionId}`);
      
      return session;
    } catch (error) {
      this.logger.error('Error assigning staff to session:', error);
      throw error;
    }
  }

  async getSessionHistory(sessionId, userId, userRole) {
    try {
      const session = await this.backendApi.getCounselingSession(sessionId);

      if (!session) {
        throw new Error('Session not found');
      }

      // Check permissions
      const hasAccess = session.user_id === userId || 
                       ['admin', 'staff', 'psikolog'].includes(userRole) ||
                       session.assigned_staff_id === userId;

      if (!hasAccess) {
        throw new Error('Access denied');
      }

      return {
        sessionId,
        messages: session.messages || [],
        sessionType: session.session_type,
        status: session.status,
        createdAt: session.created_at,
        assignedStaff: session.assigned_staff
      };
    } catch (error) {
      this.logger.error('Error getting session history:', error);
      throw error;
    }
  }

  async closeSession(sessionId, staffId, summary = null) {
    try {
      await this.backendApi.closeSession(sessionId, {
        closedBy: staffId,
        summary,
        closedAt: new Date().toISOString()
      });

      this.logger.info(`Session ${sessionId} closed by staff ${staffId}`);

      return { message: 'Session closed successfully' };
    } catch (error) {
      this.logger.error('Error closing session:', error);
      throw error;
    }
  }

  async getActiveSessionsForStaff(staffId) {
    try {
      const sessions = await this.backendApi.getStaffSessions(staffId);
      return sessions;
    } catch (error) {
      this.logger.error('Error getting staff sessions:', error);
      throw error;
    }
  }
}