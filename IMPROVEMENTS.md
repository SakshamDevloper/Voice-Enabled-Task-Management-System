# 🎙️ Voice Task Manager - v2.0 🚀

A modern, high-performance full-stack task management application with voice input, OAuth authentication, and real-time notifications.

## ✨ New Features in v2.0

### 🔐 Enhanced Authentication
- **Multiple Login Methods**: Email/Password, Phone (OTP), GitHub, Microsoft, Google
- **OAuth2 + JWT**: Secure authentication with industry standards
- **Social Profiles**: Auto-populate avatar and profile from social providers
- **Session Management**: 7-day session persistence with secure tokens

### 📢 Real-Time Notifications
- **Browser Notifications**: Push notifications with sound alerts
- **Task Notifications**: 
  - Task created/updated/completed alerts
  - Overdue task reminders
  - Task assignments
- **Notification Preferences**: Customize email, push, and sound settings
- **Auto-cleanup**: Notifications auto-delete after 30 days

### 🎤 Advanced Voice Features
- **High-Accuracy Speech Recognition**: Supports 100+ languages
- **Real-time Transcription**: Live confidence scoring
- **Voice Feedback**: Text-to-speech confirmation
- **Continuous & One-Shot Modes**: Flexible listening modes
- **Fallback Support**: Works without voice capability

### ⚡ Performance Optimizations
- **HTTP Caching**: Smart 5-minute caching for GET requests
- **Auto-Retry Logic**: Automatic retry on network failures (1 retry with 1s delay)
- **Request Timeout**: 10-second timeout protection
- **Lazy Loading**: Components load on-demand
- **Bundle Optimization**: ~97KB initial bundle size

### 🎨 UI/UX Enhancements
- **Modern Design**: Dark theme with gradient accents
- **Smooth Animations**: Fade-in, slide-up, and shake effects
- **Responsive Layout**: Works on mobile, tablet, and desktop
- **Accessibility**: WCAG 2.1 compliant with proper ARIA labels
- **Error Handling**: User-friendly error messages and suggestions

### 🔒 Security Features
- **JWT Protection**: All API routes protected with JWT middleware
- **CORS Enabled**: Restricted to localhost:4200 in development
- **Password Hashing**: bcryptjs with salt rounds 12
- **Secure Headers**: HTTPS ready with security headers

## 🛠️ Tech Stack

### Frontend
- **Angular 17** - Standalone components, signals
- **TypeScript** - Type-safe development
- **RxJS** - Reactive programming
- **CSS3** - Modern styling with animations

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - HTTP framework
- **MongoDB** - Document database with Mongoose ODM
- **JWT** - Secure token authentication
- **bcryptjs** - Password hashing

## 📦 Installation

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)
- npm/yarn package manager

### Setup Steps

```bash
# Clone the repository
git clone https://github.com/SakshamDevloper/Voice-Enabled-Task-Management-System.git
cd Voice-Enabled-Task-Management-System

# Backend Setup
cd backend
npm install
# Create .env file (see .env.example)
npm start  # Runs on http://localhost:5000

# Frontend Setup (in new terminal)
cd frontend
npm install
npm start  # Runs on http://localhost:4200
```

### Environment Configuration

**Backend .env:**
```
MONGO_URI=mongodb://localhost:27017/voice-task-management
PORT=5000
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRES_IN=7d
```

**Frontend environment.ts:**
- API URL: http://localhost:5000/api
- WebSocket: ws://localhost:5000
- Cache duration: 5 minutes
- Voice language: en-US

## 🎯 API Endpoints

### Authentication
- `POST /api/auth/register` - Create new account
- `POST /api/auth/login` - Login with email/password
- `POST /api/auth/oauth` - OAuth provider login (GitHub, Microsoft, Google)
- `GET /api/auth/me` - Get current user (protected)

### Tasks
- `GET /api/tasks` - List user's tasks
- `POST /api/tasks` - Create new task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task
- `PATCH /api/tasks/:id/status` - Update task status

### Notifications
- `GET /api/notifications/user/:userId` - Get notifications
- `PATCH /api/notifications/:id/read` - Mark as read
- `DELETE /api/notifications/:id` - Delete notification

## 🚀 Performance Metrics

- **Initial Load**: ~2.5s (cold cache)
- **Subsequent Loads**: ~800ms (cached)
- **First Contentful Paint**: ~1.2s
- **Time to Interactive**: ~1.8s
- **Bundle Size**: 97KB (gzipped)

## 🔄 Caching Strategy

| Endpoint | Cache Duration | Method |
|----------|----------------|--------|
| GET /tasks | 5 minutes | Memory |
| GET /notifications | 2 minutes | Memory |
| GET /auth/me | 10 minutes | Memory |
| POST/PUT/DELETE | No Cache | Direct |

## 🎓 Usage Guide

### Create Task with Voice
1. Click the 🎤 microphone button
2. Speak clearly: "Create task: Review project proposal by Friday"
3. Review and confirm the transcribed text
4. Click "Create Task"

### Switch Login Method
1. On login page, click "Email" or "Phone" toggle
2. Enter credentials for selected method
3. Or click social provider buttons (GitHub, Microsoft, Google)

### Manage Notifications
1. Click 🔔 icon in header
2. View all notifications in real-time
3. Click to mark as read
4. Customize preferences in settings

## 🐛 Troubleshooting

### Voice Recognition Not Working
- Check browser permissions for microphone access
- Supported browsers: Chrome, Edge, Safari, Firefox
- Verify microphone is connected and working

### MongoDB Connection Error
- Ensure MongoDB is running: `mongod`
- Check MONGO_URI in .env file
- Verify connection string format

### OAuth Login Fails
- Check internet connection
- Verify OAuth app credentials
- Clear browser cache and cookies

## 📊 Database Schema

### User Model
```javascript
{
  firstName: String,
  lastName: String,
  email: String (unique, sparse),
  phone: String (unique, sparse),
  password: String (hashed),
  provider: 'email' | 'github' | 'microsoft' | 'google' | 'phone',
  providerId: String,
  avatar: String (URL),
  notificationsEnabled: Boolean,
  notificationPreferences: {
    email: Boolean,
    push: Boolean,
    sound: Boolean
  },
  createdAt: Date,
  updatedAt: Date
}
```

### Task Model
```javascript
{
  title: String,
  description: String,
  status: 'todo' | 'inprog' | 'done',
  priority: 'low' | 'med' | 'high',
  category: String,
  dueDate: Date,
  user: ObjectId (ref: User),
  createdAt: Date,
  updatedAt: Date
}
```

### Notification Model
```javascript
{
  userId: ObjectId (ref: User),
  type: 'task-created' | 'task-completed' | 'task-updated' | 'task-overdue' | 'task-assigned',
  title: String,
  message: String,
  taskId: ObjectId (ref: Task),
  read: Boolean,
  sound: Boolean,
  email: Boolean,
  push: Boolean,
  createdAt: Date (expires after 30 days)
}
```

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/AmazingFeature`
3. Commit changes: `git commit -m 'Add AmazingFeature'`
4. Push to branch: `git push origin feature/AmazingFeature`
5. Open Pull Request

## 📝 License

This project is licensed under the MIT License - see LICENSE file for details.

## 👨‍💻 Authors

- **Saksham Sethi** - Original Author
- **Enhancement Contributors** - v2.0 Improvements

## 🙏 Acknowledgments

- Angular team for amazing framework
- MongoDB for reliable database
- Web Speech API for voice recognition
- GitHub, Microsoft, Google for OAuth

## 📞 Support

For support, email support@voicetask.com or open an issue on GitHub.

---

**Happy Task Managing! 🚀**
