export function setupRoutes(app, chatService, logger) {
  // Health check
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'healthy',
      service: 'mindcare-chat-service',
      timestamp: new Date().toISOString(),
      uptime: process.uptime()
    });
  });

  // Get active sessions (admin/staff only)
  app.get('/api/sessions/active', async (req, res) => {
    try {
      // TODO: Add authentication middleware
      const staffId = req.headers['user-id']; // Temporary - should come from JWT
      
      if (!staffId) {
        return res.status(401).json({ error: 'Authentication required' });
      }

      const sessions = await chatService.getActiveSessionsForStaff(staffId);
      res.json(sessions);
    } catch (error) {
      logger.error('Error getting active sessions:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // Get session history
  app.get('/api/sessions/:sessionId/history', async (req, res) => {
    try {
      const { sessionId } = req.params;
      const userId = req.headers['user-id']; // Temporary - should come from JWT
      const userRole = req.headers['user-role']; // Temporary - should come from JWT

      if (!userId) {
        return res.status(401).json({ error: 'Authentication required' });
      }

      const history = await chatService.getSessionHistory(sessionId, userId, userRole);
      res.json(history);
    } catch (error) {
      logger.error('Error getting session history:', error);
      
      if (error.message === 'Session not found') {
        return res.status(404).json({ error: 'Session not found' });
      }
      
      if (error.message === 'Access denied') {
        return res.status(403).json({ error: 'Access denied' });
      }
      
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // Close session (staff only)
  app.post('/api/sessions/:sessionId/close', async (req, res) => {
    try {
      const { sessionId } = req.params;
      const { summary } = req.body;
      const staffId = req.headers['user-id']; // Temporary - should come from JWT
      const userRole = req.headers['user-role']; // Temporary - should come from JWT

      if (!staffId || !['admin', 'staff', 'psikolog'].includes(userRole)) {
        return res.status(403).json({ error: 'Staff access required' });
      }

      const result = await chatService.closeSession(sessionId, staffId, summary);
      res.json(result);
    } catch (error) {
      logger.error('Error closing session:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // Test n8n connection (admin only)
  app.get('/api/test/n8n', async (req, res) => {
    try {
      const userRole = req.headers['user-role']; // Temporary - should come from JWT

      if (userRole !== 'admin') {
        return res.status(403).json({ error: 'Admin access required' });
      }

      const testResult = await chatService.n8nService.testConnection();
      res.json(testResult);
    } catch (error) {
      logger.error('Error testing n8n connection:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // Get service statistics (admin only)
  app.get('/api/stats', async (req, res) => {
    try {
      const userRole = req.headers['user-role']; // Temporary - should come from JWT

      if (userRole !== 'admin') {
        return res.status(403).json({ error: 'Admin access required' });
      }

      // TODO: Implement statistics collection
      const stats = {
        totalSessions: 0,
        activeSessions: 0,
        messagesProcessed: 0,
        escalationsToday: 0,
        aiResponseTime: 0
      };

      res.json(stats);
    } catch (error) {
      logger.error('Error getting statistics:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
}