# 🚀 LinkUp - Quick Reference Card

## 📍 URLs
| Service | URL | Status |
|---------|-----|--------|
| Frontend | http://localhost:5173 | ✅ Running |
| Backend | http://localhost:7777 | ✅ Running |
| Database | MongoDB Atlas | ✅ Connected |

---

## 🔑 Test Credentials

### Signup
```
Name: Test User
DOB: 1990-01-01
Email: test@example.com
Password: TestPass123!@#
```

### Login
```
Email: test@example.com
Password: TestPass123!@#
```

---

## 📂 Key Files Location

```
Authentication Form
└─ client/src/components/FirstPage/AuthForm.jsx

API Service
└─ client/src/services/api.js

Toast Notifications
└─ client/src/components/Toast.jsx

Backend Routes
└─ server/src/routes/auth.js

Database Models
└─ server/src/models/user.js

Validation
└─ server/src/utils/validation.js
```

---

## 🎯 Start Commands

### Terminal 1 - Backend
```bash
cd server
npm run dev
```

### Terminal 2 - Frontend
```bash
cd client
npm run dev
```

### Open Browser
```
http://localhost:5173
```

---

## 📦 Dependencies

### Backend
- express, cors, mongoose, bcryptjs, jsonwebtoken
- validator, dotenv, cookie-parser, nodemon

### Frontend
- react, vite, tailwindcss, axios, lucide-react
- react-dom, framer-motion, aos

---

## 🔌 API Endpoints

| Method | Endpoint | Body | Response |
|--------|----------|------|----------|
| POST | /signup | name, dob, email, password | {success, message, user} |
| POST | /login | email, password | {success, message, user, token} |
| POST | /logout | - | {success, message} |

---

## 💾 Environment Variables

### Server (.env)
```
PORT=7777
MONGO_URI=mongodb+srv://...
JWT_SECRET=your_secret
FRONTEND_URL=http://localhost:5173
NODE_ENV=development
```

### Client (.env)
```
VITE_BACKEND_URL=http://localhost:7777
```

---

## ✨ Features

- ✅ User Registration
- ✅ User Login/Logout
- ✅ Password Hashing
- ✅ JWT Authentication
- ✅ Form Validation
- ✅ Toast Notifications
- ✅ Error Handling
- ✅ Database Storage
- ✅ CORS Enabled
- ✅ Responsive Design

---

## 🧪 Testing

### Check Backend
```bash
curl http://localhost:7777/test
```

### Check Frontend
- Open browser
- Check Console (F12)
- Check Network tab
- Try signup/login

---

## 🛠 Common Commands

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# View logs
npm run dev  # Shows live logs

# Kill process on port
kill -9 $(lsof -t -i:7777)

# Check port usage
lsof -i :7777
```

---

## 🔍 Debugging

1. **CORS Error?** → Backend not running
2. **Connection refused?** → Check port 7777
3. **Form not submitting?** → Check validation
4. **Toast not showing?** → Check component import
5. **DB error?** → Verify MongoDB URI
6. **Env variables undefined?** → Restart dev server

---

## 📱 UI Components

### Toast Types
- 🟢 Success - Account created/Login successful
- 🔴 Error - Invalid credentials/Validation failed
- 🟡 Warning - Important notices
- 🔵 Info - Information messages

### Form Features
- Real-time validation
- Icon feedback
- Error messages
- Loading state
- Submit button

---

## 💡 Pro Tips

1. Check browser DevTools (F12) for errors
2. Check Network tab to inspect API calls
3. Use console.log() in components
4. Check backend terminal for server logs
5. Verify .env variables are set
6. Clear cache if styles don't update
7. Use localStorage for debugging
8. Test with different browsers
9. Keep sensitive data in .env

---

## 📚 Documentation

- `INTEGRATION_GUIDE.md` - Complete guide
- `SETUP_COMPLETE.md` - Quick start
- `COMMANDS.md` - Useful commands
- `COMPLETION_SUMMARY.md` - Full summary

---

## 🚀 Production Checklist

- [ ] Environment variables set
- [ ] Database connection verified
- [ ] CORS configured for production URL
- [ ] Frontend built (`npm run build`)
- [ ] Backend tested all endpoints
- [ ] Error handling verified
- [ ] Security measures in place
- [ ] Performance optimized
- [ ] Mobile responsive tested
- [ ] All features working

---

## ⚡ Performance Tips

1. Use production builds
2. Enable gzip compression
3. Optimize images
4. Cache API responses
5. Use CDN for static files
6. Lazy load components
7. Minimize bundle size
8. Use Web Workers for heavy tasks

---

## 🎨 Customization

### Change Colors
Edit: `client/src/components/FirstPage/AuthForm.jsx`
- Blue → Any color class

### Change Toast Duration
Edit: `client/src/components/Toast.jsx`
- `duration={4000}` → Change milliseconds

### Change Form Layout
Edit: `client/src/components/FirstPage/AuthForm.jsx`
- Modify className and elements

### Add New Fields
1. Add to form state
2. Add input element
3. Add validation
4. Add to API payload
5. Update backend schema

---

## 🔐 Security Reminders

- ✅ Never commit .env files
- ✅ Use strong JWT secrets
- ✅ Always hash passwords
- ✅ Validate on frontend AND backend
- ✅ Use HTTPS in production
- ✅ Keep dependencies updated
- ✅ Use CORS whitelist
- ✅ Sanitize user inputs

---

## 📞 Need Help?

1. Check documentation files
2. Review error messages
3. Check browser console
4. Check backend logs
5. Verify environment setup
6. Test with simple data
7. Review code comments

---

## 📅 Version Info

- **Version**: 1.0.0
- **Date**: November 18, 2025
- **Status**: Production Ready ✅

---

**Happy Coding! 🎉**

*Last Updated: November 18, 2025*
