# CipherVault 🔐 
### Secure thinking powered by AI

CipherVault is a secure AI-powered full-stack notes application designed to provide a private space for thinking, writing, and organizing ideas — enhanced by intelligent assistance while maintaining strong security principles.

Built as a real-world full-stack system, CipherVault focuses on authentication, user-specific data isolation, RESTful backend design, and AI-assisted productivity.

---

## 🚀 Live Features

✅ Secure user authentication (bcrypt + sessions)  
✅ Private user-specific note storage  
✅ Full CRUD note management  
✅ AI assistant ("Guardian") integrated into workflow  
✅ Protected backend APIs  
✅ Modern React component architecture  
✅ PostgreSQL relational database design  

---

## 📸 Preview

### 🔐 Authentication Interface
![Login](./screenshots/login.png)

### 🤖 Notes with Guardian AI Assistant
![AI](./screenshots/app.png)

---

## 🧠 Core Features

### 🔐 Security-First Authentication
- Email-based login system
- bcrypt password hashing
- Session-based authentication
- Protected API middleware
- User data isolation by session

---

### 📝 Intelligent Notes System
- Create and delete notes dynamically
- Persistent PostgreSQL storage
- RESTful backend endpoints
- Secure data ownership model

---

### 🤖 Guardian — AI Assistant
- Context-aware AI interaction
- Uses user notes for contextual responses
- Designed to enhance thinking rather than replace it
- Secure backend API integration

---

## 🏗 Architecture Overview

React Frontend (SPA)
↓
Express.js Backend (API + Authentication)
↓
PostgreSQL Database (Users + Notes)
↓
OpenAI API (Guardian AI Assistant)
---

## ⚙️ Tech Stack

### Frontend
- React
- Vite
- Material UI

### Backend
- Node.js
- Express.js

### Database
- PostgreSQL

### Security
- bcrypt password hashing
- express-session authentication

### AI Integration
- OpenAI API

---

## 🔒 Security Design

CipherVault is built with security as a core principle:

- Passwords hashed using bcrypt
- Session-based authentication
- Protected API endpoints
- User-specific query filtering
- Backend-controlled AI requests

---

## 📂 Project Structure


