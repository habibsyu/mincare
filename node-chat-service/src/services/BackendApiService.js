import axios from 'axios';

export class BackendApiService {
  constructor(baseUrl, logger) {
    this.baseUrl = baseUrl;
    this.logger = logger;
    
    this.client = axios.create({
      baseURL: baseUrl,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });

    // Add response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        this.logger.error('Backend API error:', {
          url: error.config?.url,
          method: error.config?.method,
          status: error.response?.status,
          message: error.message,
          data: error.response?.data
        });
        throw error;
      }
    );
  }

  async createCounselingSession(data) {
    try {
      const response = await this.client.post('/counseling/sessions', data);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to create counseling session: ${error.message}`);
    }
  }

  async getCounselingSession(sessionId) {
    try {
      const response = await this.client.get(`/counseling/sessions/${sessionId}`);
      return response.data;
    } catch (error) {
      if (error.response?.status === 404) {
        return null;
      }
      throw new Error(`Failed to get counseling session: ${error.message}`);
    }
  }

  async addMessageToSession(sessionId, messageData) {
    try {
      const response = await this.client.post(`/counseling/sessions/${sessionId}/messages`, {
        message: messageData
      });
      return response.data;
    } catch (error) {
      throw new Error(`Failed to add message to session: ${error.message}`);
    }
  }

  async escalateSession(sessionId, escalationData) {
    try {
      const response = await this.client.put(`/counseling/sessions/${sessionId}/escalate`, escalationData);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to escalate session: ${error.message}`);
    }
  }

  async assignStaffToSession(sessionId, staffId) {
    try {
      const response = await this.client.put(`/counseling/sessions/${sessionId}/assign`, {
        staffId
      });
      return response.data;
    } catch (error) {
      throw new Error(`Failed to assign staff to session: ${error.message}`);
    }
  }

  async closeSession(sessionId, closeData) {
    try {
      const response = await this.client.put(`/counseling/sessions/${sessionId}/close`, closeData);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to close session: ${error.message}`);
    }
  }

  async getStaffSessions(staffId) {
    try {
      const response = await this.client.get(`/counseling/sessions`, {
        params: { staffId, status: 'open' }
      });
      return response.data;
    } catch (error) {
      throw new Error(`Failed to get staff sessions: ${error.message}`);
    }
  }

  async createEscalationNotification(data) {
    try {
      const response = await this.client.post('/escalations/notifications', data);
      return response.data;
    } catch (error) {
      this.logger.warn(`Failed to create escalation notification: ${error.message}`);
      // Don't throw error as this is not critical
      return null;
    }
  }

  async verifyUser(userId, token) {
    try {
      const response = await this.client.get(`/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      if (error.response?.status === 401 || error.response?.status === 403) {
        return null;
      }
      throw new Error(`Failed to verify user: ${error.message}`);
    }
  }

  async healthCheck() {
    try {
      const response = await this.client.get('/health');
      return { healthy: true, data: response.data };
    } catch (error) {
      return { healthy: false, error: error.message };
    }
  }
}