import React, { useState, useEffect, useRef } from 'react';
import { useSocket } from '../../providers/SocketProvider';
import { useAuthStore } from '../../stores/authStore';
import { Send, Bot, User, AlertCircle, Phone, MessageCircle } from 'lucide-react';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const ChatPage = () => {
  const { socket, isConnected } = useSocket();
  const { user, isAuthenticated } = useAuthStore();
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const [isEscalated, setIsEscalated] = useState(false);
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (socket && isConnected) {
      initializeChat();
      setupSocketListeners();
    }
    return () => {
      if (socket) {
        socket.off('bot_reply');
        socket.off('handover_accepted');
        socket.off('session_closed');
        socket.off('typing_start');
        socket.off('typing_stop');
      }
    };
  }, [socket, isConnected]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const initializeChat = () => {
    const newSessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    setSessionId(newSessionId);
    
    socket.emit('join_session', {
      sessionId: newSessionId,
      userId: user?.id || null
    });

    // Add welcome message
    setMessages([
      {
        id: 1,
        text: "Hello! I'm your AI mental health support assistant. I'm here to listen and provide support. How are you feeling today?",
        sender: 'bot',
        timestamp: new Date().toISOString()
      }
    ]);
    
    setLoading(false);
  };

  const setupSocketListeners = () => {
    socket.on('bot_reply', (data) => {
      setIsTyping(false);
      setMessages(prev => [...prev, {
        id: Date.now(),
        text: data.message,
        sender: 'bot',
        timestamp: new Date().toISOString(),
        confidence: data.confidence,
        escalationSuggested: data.escalationSuggested
      }]);
    });

    socket.on('handover_accepted', (data) => {
      setIsEscalated(true);
      setMessages(prev => [...prev, {
        id: Date.now(),
        text: `A human counselor (${data.counselorName}) has joined the conversation and will assist you from here.`,
        sender: 'system',
        timestamp: new Date().toISOString()
      }]);
    });

    socket.on('session_closed', () => {
      setMessages(prev => [...prev, {
        id: Date.now(),
        text: "This session has been closed. Thank you for using our support service. Take care!",
        sender: 'system',
        timestamp: new Date().toISOString()
      }]);
    });

    socket.on('typing_start', () => {
      setIsTyping(true);
    });

    socket.on('typing_stop', () => {
      setIsTyping(false);
    });
  };

  const sendMessage = (e) => {
    e.preventDefault();
    if (!inputMessage.trim() || !socket || !sessionId) return;

    const newMessage = {
      id: Date.now(),
      text: inputMessage,
      sender: 'user',
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, newMessage]);
    
    socket.emit('send_message', {
      sessionId,
      message: inputMessage,
      userId: user?.id || null
    });

    setInputMessage('');
    setIsTyping(true);
  };

  const requestHandover = () => {
    if (!socket || !sessionId) return;
    
    socket.emit('request_escalation', {
      sessionId,
      reason: 'User requested human counselor',
      userId: user?.id || null
    });

    setMessages(prev => [...prev, {
      id: Date.now(),
      text: "I've requested a human counselor to join our conversation. Please wait a moment while we connect you.",
      sender: 'system',
      timestamp: new Date().toISOString()
    }]);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Connection Error</h2>
          <p className="text-gray-600 mb-4">Unable to connect to chat service. Please try again.</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-full p-2">
                  <MessageCircle className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-semibold text-gray-900">
                    {isEscalated ? 'Human Counselor Chat' : 'AI Support Chat'}
                  </h1>
                  <p className="text-sm text-gray-500">
                    {isConnected ? 'Connected' : 'Connecting...'}
                  </p>
                </div>
              </div>
              
              {!isEscalated && (
                <button
                  onClick={requestHandover}
                  className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                >
                  <Phone className="w-4 h-4" />
                  <span>Talk to Human</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Chat Messages */}
        <div className="h-[calc(100vh-200px)] overflow-y-auto p-6">
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex items-start space-x-3 max-w-xs lg:max-w-md ${
                  message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                }`}>
                  {/* Avatar */}
                  <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                    message.sender === 'user' 
                      ? 'bg-blue-500' 
                      : message.sender === 'bot'
                      ? 'bg-green-500'
                      : 'bg-gray-500'
                  }`}>
                    {message.sender === 'user' ? (
                      <User className="w-4 h-4 text-white" />
                    ) : message.sender === 'bot' ? (
                      <Bot className="w-4 h-4 text-white" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-white" />
                    )}
                  </div>

                  {/* Message Bubble */}
                  <div className={`rounded-2xl px-4 py-2 ${
                    message.sender === 'user'
                      ? 'bg-blue-500 text-white'
                      : message.sender === 'bot'
                      ? 'bg-white border border-gray-200 text-gray-900'
                      : 'bg-yellow-50 border border-yellow-200 text-yellow-800'
                  }`}>
                    <p className="text-sm">{message.text}</p>
                    <p className={`text-xs mt-1 ${
                      message.sender === 'user' 
                        ? 'text-blue-100' 
                        : 'text-gray-500'
                    }`}>
                      {formatTime(message.timestamp)}
                    </p>
                    
                    {/* Escalation suggestion */}
                    {message.escalationSuggested && !isEscalated && (
                      <div className="mt-2 pt-2 border-t border-gray-200">
                        <button
                          onClick={requestHandover}
                          className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full hover:bg-green-200 transition-colors"
                        >
                          Talk to a human counselor
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex justify-start">
                <div className="flex items-start space-x-3 max-w-xs lg:max-w-md">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                  <div className="bg-white border border-gray-200 rounded-2xl px-4 py-2">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Message Input */}
        <div className="bg-white border-t p-4">
          <form onSubmit={sendMessage} className="flex space-x-4">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 border border-gray-300 rounded-full px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={!isConnected}
            />
            <button
              type="submit"
              disabled={!inputMessage.trim() || !isConnected}
              className={`bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 transition-colors ${
                !inputMessage.trim() || !isConnected ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              <Send className="w-5 h-5" />
            </button>
          </form>
          
          {!isAuthenticated && (
            <p className="text-xs text-gray-500 mt-2 text-center">
              Your conversation is anonymous. <a href="/auth/login" className="text-blue-600 hover:underline">Sign in</a> to save your chat history.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatPage;