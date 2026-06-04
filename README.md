# 🎙️ VoiceTask: Voice-Enabled Task Management System

[![Angular](https://img.shields.io/badge/Angular-DD0031?style=for-the-badge&logo=angular&logoColor=white)](https://angular.dev)
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org)
[![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

**VoiceTask** is a premium, full-stack, voice-enabled task management application built using Angular 17 and Node.js. It features automatic speech recognition (Web Speech API), a responsive Kanban-style task board, multi-provider authentication (JWT-based email/password, phone, and OAuth2), and a WebSocket-powered real-time alert system with native browser push notifications.

---

## ✨ Features

### 🎤 Voice-Powered Control
- **Speech-to-Text Input**: Click the microphone icon to quickly transcribe task titles and descriptions.
- **Multilingual Support**: High-accuracy speech recognition supporting over 100 languages.
- **Voice Confirmation**: Auditory text-to-speech feedback for successful voice interactions.

### 📋 Kanban Board & Time Selection
- **Status Columns**: Drag/toggle tasks between **To Do**, **In Progress**, and **Done**.
- **Task Prioritization**: Categorize tasks by Priority (High, Medium, Low) and custom tags (e.g. Work, Personal).
- **Exact Time Scheduling**: Select the precise date and time a task is due using the `datetime-local` selector.

### 🔔 Real-Time Alerts & Notification Center
- **WebSocket Broker**: Instant, real-time alert synchronization between client and server.
- **Task Overdue Scheduler**: A background worker scans database records and triggers alerts for past-due tasks.
- **Interactive Notification Bell**: View unread counts, mark items as read, delete specific logs, or clear all entries.
- **Push & Sound Alerts**: Native browser desktop notifications paired with customizable sound indicators.

### 🔐 Advanced Multi-Method Authentication
- **Secure Email & Password Login**: Hashed using bcryptjs (salt rounds: 12).
- **Phone Number Mode**: Input phone number for OTP-ready access.
- **OAuth 2.0 Integration**: Log in directly using social credentials (GitHub, Google, Microsoft).
- **Session Persistence**: JWT-protected authentication sessions (valid for 7 days).

---

## 🛠️ Architecture & Tech Stack

### Frontend
- **Angular 17**: Standalone components, reactive design system, and signals.
- **RxJS**: BehaviorSubject state managers and reactive HTTP pipes.
- **Vanilla CSS**: Styled with a dark mode glassmorphism layout, smooth transitions, and accessibility (WCAG 2.1) cues.

### Backend
- **Node.js & Express**: Fast, lightweight RESTful routing and CORS controls.
- **MongoDB & Mongoose**: Flexible schema structures, index optimizations, and automatic TTL indexes for clearing notifications older than 30 days.
- **WebSocket (`ws`)**: Low-latency, full-duplex socket server.

---

## ⚙️ Quick Start & Installation

### Prerequisites
- Node.js 18+
- MongoDB (running locally or via MongoDB Atlas)

### 1. Clone the Repository
```bash
git clone https://github.com/SakshamDevloper/Voice-Enabled-Task-Management-System.git
cd Voice-Enabled-Task-Management-System
```

### 2. Configure Environment Variables
Create a `.env` file in the `backend/` directory:
```env
MONGO_URI=mongodb://localhost:27017/voice-task-management
PORT=5000
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRES_IN=7d
```

### 3. Start the Backend Server
```bash
cd backend
npm install
npm start  # Runs server on http://localhost:5000 (WebSocket connects to ws://localhost:5000)
```

### 4. Start the Angular Frontend
In a new terminal window:
```bash
cd frontend
npm install
npm start  # Launches dev server on http://localhost:4200
```
Open **[http://localhost:4200](http://localhost:4200)** in your web browser.

---

## 📡 API Endpoints

### 🔐 Authentication (`/api/auth`)
- `POST /api/auth/register` — Create a new user account.
- `POST /api/auth/login` — Login with email and password credentials.
- `POST /api/auth/oauth` — OAuth provider login validation.
- `GET /api/auth/me` — Retrieve active profile information (Protected).

### 📋 Tasks (`/api/tasks`)
- `GET /api/tasks` — List current user's tasks (Protected).
- `POST /api/tasks` — Create a new task (Protected).
- `PUT /api/tasks/:id` — Update task details or status (Protected).
- `DELETE /api/tasks/:id` — Delete a task (Protected).

### 🔔 Notifications (`/api/notifications`)
- `GET /api/notifications/user/:userId` — Fetch recent user notifications (Protected).
- `PATCH /api/notifications/:id/read` — Mark a notification as read (Protected).
- `DELETE /api/notifications/:id` — Delete a notification (Protected).

---

## 👨‍💻 Contributing
Contributions make the open-source community an amazing place to learn, inspire, and create.
1. Fork the Project.
2. Create your Feature Branch: `git checkout -b feature/AmazingFeature`
3. Commit your Changes: `git commit -m 'Add some AmazingFeature'`
4. Push to the Branch: `git push origin feature/AmazingFeature`
5. Open a Pull Request.

---

## 📝 License & Authors
- **Saksham Sethi** — Original Author & Principal Maintainer.
- Distributed under the **MIT License**. See `LICENSE` for more information.
