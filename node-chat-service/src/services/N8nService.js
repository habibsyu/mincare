import axios from 'axios';

export class N8nService {
  constructor(webhookUrl, apiKey, logger) {
    this.webhookUrl = webhookUrl;
    this.apiKey = apiKey;
    this.logger = logger;
    
    this.client = axios.create({
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
        ...(apiKey && { 'Authorization': `Bearer ${apiKey}` })
      }
    });
  }

  async sendToAI(data) {
    try {
      if (!this.webhookUrl) {
        throw new Error('N8N webhook URL not configured');
      }

      const payload = {
        ...data,
        timestamp: new Date().toISOString(),
        source: 'mindcare-chat-service'
      };

      this.logger.debug('Sending to n8n:', payload);

      const response = await this.client.post(this.webhookUrl, payload);
      
      this.logger.debug('n8n response received:', response.data);

      return this.processN8nResponse(response.data);
    } catch (error) {
      this.logger.error('N8N service error:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
        url: this.webhookUrl
      });

      return this.getFallbackResponse(data.message);
    }
  }

  processN8nResponse(data) {
    // Handle different n8n response formats
    if (typeof data === 'string') {
      return {
        reply: data,
        confidence: 0.7,
        intent: 'general_support'
      };
    }

    return {
      reply: data.reply || data.message || data.response || 'I understand. Can you tell me more?',
      confidence: data.confidence || 0.8,
      intent: data.intent || 'general_support',
      escalationSuggested: data.escalationSuggested || false,
      escalationReason: data.escalationReason,
      workflowId: data.workflowId,
      processingTime: data.processingTime,
      metadata: data.metadata || {}
    };
  }

  getFallbackResponse(originalMessage) {
    const fallbackResponses = [
      "I hear you. It takes courage to reach out, and I want you to know that your feelings are valid.",
      "Thank you for sharing with me. I'm here to support you through this.",
      "It sounds like you're going through a difficult time. You don't have to face this alone.",
      "I can sense that you're struggling right now. Would you like to talk about what's been weighing on your mind?",
      "Your wellbeing matters, and I'm glad you're taking this step to seek support."
    ];

    const randomResponse = fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];

    return {
      reply: randomResponse,
      confidence: 0.6,
      intent: 'fallback_support',
      escalationSuggested: false,
      metadata: { fallback: true }
    };
  }

  async testConnection() {
    try {
      if (!this.webhookUrl) {
        return { connected: false, error: 'Webhook URL not configured' };
      }

      const testPayload = {
        message: "Connection test",
        test: true,
        timestamp: new Date().toISOString()
      };

      const response = await this.client.post(this.webhookUrl, testPayload);
      
      return { 
        connected: true, 
        status: response.status,
        responseTime: Date.now()
      };
    } catch (error) {
      return { 
        connected: false, 
        error: error.message,
        status: error.response?.status
      };
    }
  }
}