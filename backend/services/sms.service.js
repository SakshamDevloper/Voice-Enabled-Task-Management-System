// SMS Service integration (simulating Twilio or Plivo SMS gateway)
exports.sendNotificationSMS = async (toPhone, title, message) => {
  try {
    // Check if SMS credentials are configured (placeholder for real Twilio setup)
    if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN && process.env.TWILIO_PHONE_NUMBER) {
      const twilio = require('twilio');
      const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
      
      const response = await client.messages.create({
        body: `[VoiceTask] ${title}: ${message}`,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: toPhone
      });
      
      console.log(`Twilio SMS successfully dispatched to ${toPhone}: ${response.sid}`);
      return;
    }

    // Default development logging fallback
    console.log(`
==================================================
📱 [LOCAL SMS GATEWAY SIMULATION]
To Phone: ${toPhone}
Message: [VoiceTask] ${title} - ${message}
==================================================
`);
  } catch (err) {
    console.error('Error dispatching SMS alert:', err.message);
  }
};
