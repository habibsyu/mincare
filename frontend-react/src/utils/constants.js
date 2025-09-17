// Assessment Types
export const ASSESSMENT_TYPES = {
  PHQ9: 'PHQ-9',
  GAD7: 'GAD-7',
  DASS21: 'DASS-21',
  CUSTOM: 'custom'
};

// User Roles
export const USER_ROLES = {
  ADMIN: 'admin',
  STAFF: 'staff',
  USER: 'user',
  PSIKOLOG: 'psikolog'
};

// Content Types
export const CONTENT_TYPES = {
  ARTICLE: 'article',
  VIDEO: 'video',
  QUIZ: 'quiz'
};

// Content Status
export const CONTENT_STATUS = {
  DRAFT: 'draft',
  PUBLISHED: 'published'
};

// Community Platforms
export const COMMUNITY_PLATFORMS = {
  DISCORD: 'discord',
  TELEGRAM: 'telegram',
  OTHER: 'other'
};

// Session Types
export const SESSION_TYPES = {
  CHATBOT: 'chatbot',
  HUMAN_HANDOVER: 'human_handover'
};

// Session Status
export const SESSION_STATUS = {
  OPEN: 'open',
  CLOSED: 'closed',
  ESCALATED: 'escalated'
};

// Assessment Score Ranges
export const ASSESSMENT_RANGES = {
  PHQ9: {
    MINIMAL: { min: 0, max: 4, label: 'Minimal Depression', color: 'green' },
    MILD: { min: 5, max: 9, label: 'Mild Depression', color: 'yellow' },
    MODERATE: { min: 10, max: 14, label: 'Moderate Depression', color: 'orange' },
    MODERATELY_SEVERE: { min: 15, max: 19, label: 'Moderately Severe Depression', color: 'red' },
    SEVERE: { min: 20, max: 27, label: 'Severe Depression', color: 'red' }
  },
  GAD7: {
    MINIMAL: { min: 0, max: 4, label: 'Minimal Anxiety', color: 'green' },
    MILD: { min: 5, max: 9, label: 'Mild Anxiety', color: 'yellow' },
    MODERATE: { min: 10, max: 14, label: 'Moderate Anxiety', color: 'orange' },
    SEVERE: { min: 15, max: 21, label: 'Severe Anxiety', color: 'red' }
  },
  DASS21: {
    DEPRESSION: {
      NORMAL: { min: 0, max: 9, label: 'Normal', color: 'green' },
      MILD: { min: 10, max: 13, label: 'Mild', color: 'yellow' },
      MODERATE: { min: 14, max: 20, label: 'Moderate', color: 'orange' },
      SEVERE: { min: 21, max: 27, label: 'Severe', color: 'red' },
      EXTREMELY_SEVERE: { min: 28, max: 42, label: 'Extremely Severe', color: 'red' }
    },
    ANXIETY: {
      NORMAL: { min: 0, max: 7, label: 'Normal', color: 'green' },
      MILD: { min: 8, max: 9, label: 'Mild', color: 'yellow' },
      MODERATE: { min: 10, max: 14, label: 'Moderate', color: 'orange' },
      SEVERE: { min: 15, max: 19, label: 'Severe', color: 'red' },
      EXTREMELY_SEVERE: { min: 20, max: 42, label: 'Extremely Severe', color: 'red' }
    },
    STRESS: {
      NORMAL: { min: 0, max: 14, label: 'Normal', color: 'green' },
      MILD: { min: 15, max: 18, label: 'Mild', color: 'yellow' },
      MODERATE: { min: 19, max: 25, label: 'Moderate', color: 'orange' },
      SEVERE: { min: 26, max: 33, label: 'Severe', color: 'red' },
      EXTREMELY_SEVERE: { min: 34, max: 42, label: 'Extremely Severe', color: 'red' }
    }
  }
};

// API Endpoints
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    ME: '/auth/me'
  },
  ASSESSMENTS: {
    QUESTIONS: '/assessments/questions',
    SUBMIT: '/assessments',
    HISTORY: '/assessments/history'
  },
  CONTENTS: {
    LIST: '/contents',
    CREATE: '/contents',
    DETAIL: '/contents'
  },
  BLOGS: {
    LIST: '/blogs',
    CREATE: '/blogs',
    DETAIL: '/blogs'
  },
  COMMUNITY: {
    LINKS: '/community/links'
  },
  ADMIN: {
    STATS: '/admin/stats',
    USERS: '/admin/users',
    ASSESSMENTS: '/admin/assessments',
    SESSIONS: '/admin/sessions'
  }
};

// Local Storage Keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'mindcare_auth_token',
  USER_DATA: 'mindcare_user_data',
  THEME: 'mindcare_theme',
  LANGUAGE: 'mindcare_language'
};

// Default Values
export const DEFAULT_VALUES = {
  PAGINATION: {
    PAGE_SIZE: 10,
    CURRENT_PAGE: 1
  },
  THEME: 'light',
  LANGUAGE: 'en'
};

// Validation Rules
export const VALIDATION_RULES = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PASSWORD: {
    MIN_LENGTH: 8,
    PATTERN: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/
  },
  PHONE: /^[\+]?[1-9][\d]{0,15}$/
};

// Error Messages
export const ERROR_MESSAGES = {
  REQUIRED: 'This field is required',
  INVALID_EMAIL: 'Please enter a valid email address',
  INVALID_PASSWORD: 'Password must be at least 8 characters with uppercase, lowercase, and number',
  INVALID_PHONE: 'Please enter a valid phone number',
  NETWORK_ERROR: 'Network error. Please check your connection.',
  UNAUTHORIZED: 'You are not authorized to perform this action',
  SERVER_ERROR: 'Server error. Please try again later.'
};

// Success Messages
export const SUCCESS_MESSAGES = {
  LOGIN: 'Successfully logged in',
  REGISTER: 'Account created successfully',
  LOGOUT: 'Successfully logged out',
  ASSESSMENT_SUBMITTED: 'Assessment submitted successfully',
  CONTENT_CREATED: 'Content created successfully',
  CONTENT_UPDATED: 'Content updated successfully',
  CONTENT_DELETED: 'Content deleted successfully',
  PROFILE_UPDATED: 'Profile updated successfully'
};

// Socket Events
export const SOCKET_EVENTS = {
  CONNECT: 'connect',
  DISCONNECT: 'disconnect',
  JOIN_SESSION: 'join_session',
  LEAVE_SESSION: 'leave_session',
  SEND_MESSAGE: 'send_message',
  RECEIVE_MESSAGE: 'receive_message',
  BOT_REPLY: 'bot_reply',
  HANDOVER_REQUEST: 'handover_request',
  HANDOVER_ACCEPTED: 'handover_accepted',
  SESSION_CLOSED: 'session_closed',
  TYPING_START: 'typing_start',
  TYPING_STOP: 'typing_stop'
};

// Chart Colors
export const CHART_COLORS = {
  PRIMARY: '#3B82F6',
  SECONDARY: '#10B981',
  WARNING: '#F59E0B',
  DANGER: '#EF4444',
  INFO: '#6366F1',
  SUCCESS: '#059669',
  LIGHT: '#F3F4F6',
  DARK: '#1F2937'
};

// Breakpoints (matching Tailwind CSS)
export const BREAKPOINTS = {
  SM: 640,
  MD: 768,
  LG: 1024,
  XL: 1280,
  '2XL': 1536
};

// Animation Durations
export const ANIMATION_DURATION = {
  FAST: 150,
  NORMAL: 300,
  SLOW: 500
};

// File Upload Limits
export const UPLOAD_LIMITS = {
  IMAGE: {
    MAX_SIZE: 5 * 1024 * 1024, // 5MB
    ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
  },
  VIDEO: {
    MAX_SIZE: 100 * 1024 * 1024, // 100MB
    ALLOWED_TYPES: ['video/mp4', 'video/webm', 'video/ogg']
  },
  DOCUMENT: {
    MAX_SIZE: 10 * 1024 * 1024, // 10MB
    ALLOWED_TYPES: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
  }
};