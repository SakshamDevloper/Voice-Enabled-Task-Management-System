export const environment = {
  production: false,
  apiUrl: 'http://localhost:5000/api',
  wsUrl: 'ws://localhost:5000',
  
  // Performance settings
  cache: {
    enabled: true,
    duration: 5 * 60 * 1000, // 5 minutes
  },
  
  // Voice settings
  voice: {
    language: 'en-US',
    continuous: false,
    interimResults: true,
  },
  
  // Notification settings
  notifications: {
    sound: true,
    push: true,
    email: true,
    browser: true,
  },
  
  // App settings
  app: {
    name: 'VoiceTask',
    version: '2.0.0',
    debugMode: true,
  }
};
