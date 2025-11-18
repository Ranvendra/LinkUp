#!/bin/bash

# LinkUp Development - Useful Commands

# ============================================
# BACKEND COMMANDS
# ============================================

# 1. Install backend dependencies
echo "Backend - Install dependencies:"
echo "cd server && npm install"

# 2. Start backend development server
echo "Backend - Start dev server:"
echo "cd server && npm run dev"

# 3. Start backend production server
echo "Backend - Start production:"
echo "cd server && npm start"

# 4. Test backend API
echo "Backend - Test API:"
echo "curl http://localhost:7777/test"

# ============================================
# FRONTEND COMMANDS
# ============================================

# 1. Install frontend dependencies
echo "Frontend - Install dependencies:"
echo "cd client && npm install"

# 2. Start frontend development server
echo "Frontend - Start dev server:"
echo "cd client && npm run dev"

# 3. Build frontend for production
echo "Frontend - Build:"
echo "cd client && npm run build"

# 4. Preview production build
echo "Frontend - Preview build:"
echo "cd client && npm run preview"

# ============================================
# DATABASE COMMANDS
# ============================================

# 1. Connect to MongoDB (using MongoDB Compass or CLI)
echo "Database - Connection string:"
echo "mongodb+srv://username:password@cluster.mongodb.net/dbname"

# 2. View recent entries in users collection
echo "Database - Find all users:"
echo "db.users.find().sort({_id: -1}).limit(10)"

# ============================================
# TESTING COMMANDS
# ============================================

# 1. Test Signup
echo "Test Signup:"
echo 'curl -X POST http://localhost:7777/signup -H "Content-Type: application/json" -d '"'"'{
  "name": "Test User",
  "dateOfBirth": "1990-01-01",
  "email": "test@example.com",
  "password": "TestPass123!@#"
}'"'"

# 2. Test Login
echo "Test Login:"
echo 'curl -X POST http://localhost:7777/login -H "Content-Type: application/json" -d '"'"'{
  "email": "test@example.com",
  "password": "TestPass123!@#"
}'"'"

# 3. Test Logout
echo "Test Logout:"
echo "curl -X POST http://localhost:7777/logout"

# ============================================
# TROUBLESHOOTING COMMANDS
# ============================================

# 1. Check if port is in use
echo "Check port 7777:"
echo "lsof -i :7777"

# 2. Check if port 5173 is in use
echo "Check port 5173:"
echo "lsof -i :5173"

# 3. Kill process on specific port (macOS/Linux)
echo "Kill process on port 7777:"
echo "kill -9 $(lsof -t -i:7777)"

# 4. View environment variables
echo "Backend env:"
echo "cat server/.env"

echo "Frontend env:"
echo "cat client/.env"

# 5. Clear node_modules and reinstall
echo "Clean install backend:"
echo "cd server && rm -rf node_modules package-lock.json && npm install"

echo "Clean install frontend:"
echo "cd client && rm -rf node_modules package-lock.json && npm install"

# ============================================
# GIT COMMANDS
# ============================================

# 1. Stage all changes
echo "Git - Stage all:"
echo "git add ."

# 2. Commit changes
echo "Git - Commit:"
echo 'git commit -m "Setup frontend-backend integration with CORS"'

# 3. View changes
echo "Git - View changes:"
echo "git status"

# 4. View commit history
echo "Git - Log:"
echo "git log --oneline -5"

# ============================================
# MONITORING COMMANDS
# ============================================

# 1. Watch backend logs (while dev server running)
echo "Monitor - View backend process:"
echo "ps aux | grep 'node src/app.js'"

# 2. Check MongoDB connection
echo "Monitor - Test MongoDB:"
echo "curl http://localhost:7777/test"

# ============================================
# DEPLOYMENT COMMANDS
# ============================================

# 1. Build frontend for production
echo "Deploy - Build frontend:"
echo "cd client && npm run build"

# 2. Start backend in production
echo "Deploy - Start backend:"
echo "cd server && npm start"

# ============================================
# DEVELOPMENT SHORTCUTS
# ============================================

# Quick start both servers (run in separate terminals)
echo "Terminal 1 - Backend:"
echo "cd /Users/ranvendrapratapsingh/Documents/Linkup/server && npm run dev"

echo "Terminal 2 - Frontend:"
echo "cd /Users/ranvendrapratapsingh/Documents/Linkup/client && npm run dev"

echo "Then open: http://localhost:5173"

# ============================================
# USEFUL ENDPOINTS
# ============================================

echo "
ENDPOINTS:
- Test: GET http://localhost:7777/test
- Signup: POST http://localhost:7777/signup
- Login: POST http://localhost:7777/login
- Logout: POST http://localhost:7777/logout

Frontend: http://localhost:5173
Backend: http://localhost:7777
"

# ============================================
# ENVIRONMENT VARIABLES
# ============================================

echo "
SERVER .env REQUIRED:
PORT=7777
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/dbname
JWT_SECRET=your_secret_key_here
FRONTEND_URL=http://localhost:5173

CLIENT .env REQUIRED:
VITE_BACKEND_URL=http://localhost:7777
"

echo "✅ All commands ready!"
