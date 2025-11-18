# LinkUp - Frontend & Backend Integration Guide

## 🎉 Setup Complete!

Your frontend and backend are now fully connected with CORS support, proper API integration, and beautiful UI notifications.

---

## 📋 What Was Implemented

### Backend Changes (`server/`)

1. **CORS Configuration**
   - Added `cors` package to handle cross-origin requests
   - Configured to accept requests from your frontend URL
   - Credentials enabled for cookie-based authentication

2. **Enhanced API Responses**
   - All endpoints now return consistent JSON responses with `success` and `message` fields
   - Proper HTTP status codes (201 for creation, 200 for success, 400 for errors, 500 for server errors)
   - Better error messages for user feedback

3. **Updated Routes**
   - ✅ `POST /signup` - Create new account
   - ✅ `POST /login` - Login with email & password
   - ✅ `POST /logout` - Logout and clear cookies

4. **Improved Validation**
   - JSON responses instead of plain text
   - User-friendly error messages
   - Password strength validation

### Frontend Changes (`client/`)

1. **Axios API Service** (`src/services/api.js`)
   - Centralized API configuration
   - Base URL from environment variables
   - Credentials enabled for cookies
   - Reusable API methods

2. **Beautiful Toast Notifications** (`src/components/Toast.jsx`)
   - Success messages (green gradient)
   - Error messages (red gradient)
   - Warning messages (yellow gradient)
   - Info messages (blue gradient)
   - Smooth animations with auto-dismiss

3. **Enhanced Auth Form** (`src/components/FirstPage/AuthForm.jsx`)
   - Real API integration with error handling
   - Form validation
   - Loading states
   - Toast notifications for success/error
   - Data persistence in localStorage
   - Professional styling and UX

4. **Environment Configuration**
   - Updated `.env` file with `VITE_BACKEND_URL`
   - Proper environment variable naming for Vite

---

## 🚀 Running the Application

### Prerequisites
- Node.js (v14 or higher)
- MongoDB connection string
- npm or yarn

### Backend Setup

```bash
cd server

# Install dependencies
npm install

# Configure .env file with:
# - MongoDB URI
# - JWT Secret
# - Frontend URL for CORS
# - Port (default: 7777)

# Start development server
npm run dev
```

### Frontend Setup

```bash
cd client

# Install dependencies
npm install

# Configure .env file with:
# - VITE_BACKEND_URL (e.g., http://localhost:7777)

# Start development server
npm run dev
```

The frontend will be available at: `http://localhost:5173`
The backend will be running at: `http://localhost:7777`

---

## 🔧 API Endpoints

### Authentication

#### 1. Signup
```http
POST /signup
Content-Type: application/json

{
  "name": "John Doe",
  "dateOfBirth": "1995-03-15",
  "email": "john@example.com",
  "password": "SecurePass123!@#"
}
```

**Success Response (201):**
```json
{
  "success": true,
  "message": "User registered successfully. Please login to continue.",
  "user": {
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

#### 2. Login
```http
POST /login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "SecurePass123!@#"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Login successful! Welcome back.",
  "user": {
    "_id": "user_id_here",
    "name": "John Doe",
    "email": "john@example.com"
  },
  "token": "jwt_token_here"
}
```

#### 3. Logout
```http
POST /logout
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Logged out successfully."
}
```

---

## 📁 Project Structure

```
LinkUp/
├── client/                           # React Frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── FirstPage/
│   │   │   │   └── AuthForm.jsx      # Main auth component
│   │   │   └── Toast.jsx             # Notification component
│   │   ├── services/
│   │   │   └── api.js                # Axios configuration
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── .env                          # Environment variables
│   ├── .env.example                  # Example env file
│   └── package.json
│
└── server/                           # Express Backend
    ├── src/
    │   ├── app.js                    # Main app file with CORS
    │   ├── routes/
    │   │   └── auth.js               # Authentication routes
    │   ├── models/
    │   │   └── user.js               # User schema
    │   ├── middlewares/
    │   ├── utils/
    │   │   └── validation.js         # Input validation
    │   └── config/
    │       └── database.js           # MongoDB connection
    ├── .env                          # Environment variables
    ├── .env.example                  # Example env file
    └── package.json
```

---

## 🔐 Features Implemented

### Authentication
- ✅ User registration with validation
- ✅ Secure password hashing with bcrypt
- ✅ JWT token generation
- ✅ Cookie-based session management
- ✅ Login with email/password
- ✅ Logout functionality

### Validation
- ✅ Email format validation
- ✅ Password strength requirements
- ✅ Required field validation
- ✅ Duplicate email detection
- ✅ Frontend form validation

### UI/UX
- ✅ Professional form design
- ✅ Real-time validation messages
- ✅ Beautiful toast notifications
- ✅ Loading states
- ✅ Error handling
- ✅ Smooth animations
- ✅ Responsive design

### Security
- ✅ CORS enabled with credential support
- ✅ Password hashing with bcryptjs
- ✅ JWT token authentication
- ✅ HTTP-only cookies
- ✅ Input validation and sanitization

---

## 💾 Data Storage

### User Data Stored in MongoDB
```javascript
{
  _id: ObjectId,
  name: String (required, 3-30 chars),
  email: String (required, unique),
  password: String (hashed, required),
  dateOfBirth: Date (required),
  gender: String (optional),
  profilePicture: String (optional),
  interests: [String] (optional),
  about: String (optional),
  createdAt: Date,
  updatedAt: Date
}
```

### Client-Side Storage
- **localStorage**: User info & JWT token after successful login
- Keys: `user` (JSON), `token` (string)

---

## 🧪 Testing Login/Signup

### Test Signup
1. Go to `http://localhost:5173`
2. Click "Create Account"
3. Fill in the form:
   - Name: Any name
   - Date of Birth: Any date
   - Email: Your test email
   - Password: Password with uppercase, lowercase, number, and symbol (e.g., `TestPass123!@#`)
4. Click "Create Account"
5. You should see a success toast notification
6. Form will automatically switch to login mode

### Test Login
1. Fill in the login form with the email and password from signup
2. Click "Sign In"
3. You should see a success toast notification
4. User data will be saved to localStorage

### Check Browser Console
- Open DevTools (F12)
- Go to Console tab
- Check Network tab to see API calls
- Check Application > Storage > localStorage for user data

---

## 🐛 Troubleshooting

### CORS Errors
**Problem**: Getting CORS error when calling API
**Solution**: 
- Ensure backend is running on port 7777
- Check FRONTEND_URL in server .env matches your frontend URL
- Restart backend server after env changes

### Connection Refused
**Problem**: `Error: connect ECONNREFUSED 127.0.0.1:7777`
**Solution**:
- Start backend server: `cd server && npm run dev`
- Verify port 7777 is not used by another process

### Environment Variables Not Loading
**Problem**: `VITE_BACKEND_URL` is undefined
**Solution**:
- Vite requires env vars to start with `VITE_`
- Restart frontend dev server after .env changes
- Check .env file is in root of client folder

### API Returns 400 Error
**Problem**: Weak password or invalid email
**Solution**:
- Password must have: uppercase, lowercase, number, symbol (min 8 chars)
- Email must be valid format
- Check console for exact error message

### MongoDB Connection Failed
**Problem**: Database not connecting
**Solution**:
- Verify MongoDB URI in .env is correct
- Check MongoDB account credentials
- Ensure IP address is whitelisted in MongoDB Atlas
- Verify connection string format

---

## 📝 Environment Variables Reference

### Server (.env)
```properties
PORT=7777
MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/dbname
JWT_SECRET=your_secret_key_min_32_chars
FRONTEND_URL=http://localhost:5173
NODE_ENV=development
```

### Client (.env)
```properties
VITE_BACKEND_URL=http://localhost:7777
```

---

## 🔄 Data Flow

```
User inputs → Validation → API Call (Axios) → Backend
    ↓
Backend Validation → Database (MongoDB) → Response
    ↓
Handle Response → Store in localStorage → Show Toast → Navigate
```

---

## 📚 Key Dependencies

### Backend
- `express` - Web framework
- `cors` - Cross-origin request handling
- `mongoose` - MongoDB ORM
- `bcrypt`/`bcryptjs` - Password hashing
- `jsonwebtoken` - JWT generation
- `validator` - Input validation
- `dotenv` - Environment variables
- `cookie-parser` - Cookie handling

### Frontend
- `react` - UI library
- `axios` - HTTP client
- `lucide-react` - Icons
- `tailwindcss` - Styling
- `vite` - Build tool

---

## 🚀 Next Steps

1. **Add Protected Routes**
   - Create middleware to verify JWT tokens
   - Implement route guards in frontend

2. **User Profile Page**
   - Display user information
   - Allow profile editing
   - Add profile picture upload

3. **Password Reset**
   - Email verification
   - Reset token generation

4. **Two-Factor Authentication**
   - OTP implementation
   - SMS or email verification

5. **Social Login**
   - Google OAuth integration
   - GitHub OAuth integration

---

## 📞 Support

For issues or questions:
1. Check the troubleshooting section above
2. Review browser console and network tab
3. Check backend logs in terminal
4. Verify all environment variables are set correctly

---

## ✅ Verification Checklist

- [ ] Backend running on port 7777
- [ ] Frontend running on port 5173
- [ ] CORS configured correctly
- [ ] MongoDB connection established
- [ ] .env files have correct values
- [ ] npm dependencies installed
- [ ] Can see beautiful UI components
- [ ] Form validation working
- [ ] Toast notifications displaying
- [ ] Signup successful with database entry
- [ ] Login successful with token generation
- [ ] Data persists in localStorage

---

## 🎨 UI Features

### Form Styling
- Clean, modern design with Tailwind CSS
- Blue color scheme with gradient buttons
- Smooth transitions and hover effects
- Icons from lucide-react
- Responsive layout (mobile-friendly)

### Toast Notifications
- Green: Success messages
- Red: Error messages
- Yellow: Warning messages
- Blue: Info messages
- Auto-dismiss after 4 seconds
- Smooth slide-in animation
- Fixed position in top-right corner

### Validation Feedback
- Real-time error messages below fields
- Icon color changes on input
- Visual error states with red borders
- Clear validation rules

---

**Last Updated**: November 18, 2025
**Version**: 1.0.0
**Status**: Production Ready ✅
