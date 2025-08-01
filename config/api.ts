// API Configuration
export const API_CONFIG = {
  // Node.js backend (main API)
  BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000',
  
  // Flask backend (ML/AI services)
  FLASK_URL: process.env.NEXT_PUBLIC_FLASK_API_URL || 'http://localhost:5001',
  
  // API endpoints
  ENDPOINTS: {
    // Auth endpoints
    AUTH: {
      PROFILE: '/api/auth/profile',
      LOGIN: '/api/auth/login',
      REGISTER: '/api/auth/register',
      EDIT_PROFILE: '/api/auth/profile/edit',
      CHANGE_PASSWORD: '/api/auth/change-password',
    },
    
    // Chat endpoints
    CHAT: {
      HISTORY: '/api/chat/history',
      MESSAGES: '/api/chat',
      NEW: '/api/chat/new',
      SAVE: '/api/chat/save',
      DELETE: '/api/chat',
    },
    
    // Doctor endpoints
    DOCTORS: {
      LIST: '/api/doctors',
      DETAIL: '/api/doctors',
    },
    
    // Appointment endpoints
    APPOINTMENTS: {
      CREATE: '/api/appointments',
      MY_APPOINTMENTS: '/api/appointments/my-appointments',
      CANCEL: '/api/appointments',
    },
    
    // Reminder endpoints
    REMINDERS: {
      LIST: '/api/reminder',
      DELETE: '/api/reminder',
    },
    
    // Notification endpoints
    NOTIFICATIONS: {
      LIST: '/api/notifications',
      READ: '/api/notifications',
      DELETE: '/api/notifications',
    },
    
    // Reports endpoints
    REPORTS: {
      LIST: '/api/reports',
      CREATE: '/api/reports',
    },
    
    // Feedback endpoints
    FEEDBACK: {
      PUBLIC: '/api/feedback/public',
      USER: '/api/feedback/user',
      MY_FEEDBACK: '/api/feedback/my-feedback',
      SUBMIT: '/api/feedback/submit',
      DETAIL: '/api/feedback',
      ADMIN_ALL: '/api/feedback/admin/all',
      ADMIN_APPROVE: '/api/feedback/admin',
    },
    
    // Flask endpoints
    FLASK: {
      UPLOAD_REPORT: '/api/upload-report',
    },
    
    // Admin endpoints
    ADMIN: {
      LOGIN: '/api/admin/login',
      DASHBOARD_STATS: '/api/admin/dashboard-stats',
      USERS: '/api/admin/users',
      DOCTORS: '/api/admin/doctors',
      APPOINTMENTS: '/api/admin/appointments',
      REPORTS: '/api/admin/reports',
      FEEDBACK: '/api/admin/feedback',
    }
  }
}

// Helper functions to build complete URLs
export const getApiUrl = (endpoint: string) => {
  return `${API_CONFIG.BASE_URL}${endpoint}`
}

export const getFlaskUrl = (endpoint: string) => {
  return `${API_CONFIG.FLASK_URL}${endpoint}`
}
