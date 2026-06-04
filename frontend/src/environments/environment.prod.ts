export const environment = {
  production: true,
  apiUrl: 'https://api.voicetask.com/api',
  wsUrl: 'wss://api.voicetask.com',
  
  // Performance settings
  cache: {
    enabled: true,
    duration: 10 * 60 * 1000, // 10 minutes
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
    debugMode: false,
  }
};
