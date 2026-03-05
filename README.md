<div align="center">
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
  <img src="https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white" alt="Node JS" />
  <img src="https://img.shields.io/badge/Express.js-404D59?style=for-the-badge" alt="Express JS" />
  <img src="https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB" />
  <img src="https://img.shields.io/badge/Socket.io-black?style=for-the-badge&logo=socket.io&badgeColor=010101" alt="Socket.io" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
</div>

<br />

<div align="center">
  <h1 align="center">LinkUp</h1>
  <p align="center">
    <strong>A Beautiful, Full-Stack Social Networking Platform</strong>
  </p>
</div>

---

## 📖 What is LinkUp?

**LinkUp** is a modern social networking web application designed to help people connect, chat, and build their networks. Built using the powerful **MERN Stack** (MongoDB, Express, React, Node.js), this platform offers a smooth, fast, and secure experience for all users.

Whether you want to discover new people, filter users by their interests and age, or have real-time live chats, LinkUp has it all!

---

## ✨ Amazing Features

- 🔒 **Secure Authentication:** Safe login and signup system using JSON Web Tokens (JWT) stored in highly secure, browser-protected (HttpOnly) cookies.
- 📰 **Smart Discovery Feed:** A dynamic feed where you can view other registered users. It automatically hides your own profile from your view.
- 🔍 **Advanced Search & Filters:** Easily find people by typing their name, or filter them out by gender and age ranges.
- 🤝 **Connection System:** Grow your network by sending connection requests. You can view pending requests and choose to **Accept** or **Reject** them.
- 💬 **Real-Time Global Chat:** Powered by Socket.io, our chatting system allows you to instantly send and receive live messages with absolutely anyone on the platform!
- 👤 **Profile Management:** View and edit your personal details, age, gender, skills, and upload a custom profile picture URL.

---

## 🛠️ Technologies Used

### Frontend (User Interface)

- **React (with Vite):** For building the fast, interactive user interface.
- **Tailwind CSS:** For beautiful, modern, and fully responsive styling.
- **Redux Toolkit:** For globally managing the user's login state across the app.
- **React Router:** For smooth page navigation without reloading the browser.
- **Axios:** To talk to our backend server and fetch data.

### Backend (Server & Database)

- **Node.js & Express.js:** The fast server environment running the core API logic.
- **MongoDB & Mongoose:** The NoSQL database used to store all user profiles, connections, and chat messages.
- **Socket.io:** The engine behind our instant, real-time messaging system.
- **Bcrypt & JWT:** For securely hashing passwords and keeping user logins safe.

---

## 🚀 How to Run the Project Locally

If you want to download this code and run it on your own computer, follow these simple steps!

### 1. Prerequisites

Make sure you have downloaded and installed:

- [Node.js](https://nodejs.org/)
- [Git](https://git-scm.com/)
- A free MongoDB database URL (from [MongoDB Atlas](https://www.mongodb.com/atlas/database))

### 2. Backend Setup

1. Open your terminal and navigate into the `server` folder:
   ```bash
   cd server
   ```
2. Install all the required packages:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `server` folder and add your secret keys:
   ```env
   PORT=7777
   MONGO_URI=your_mongodb_connection_string_here
   JWT_SECRET=any_random_secret_password_here
   FRONTEND_URL=http://localhost:5173
   ```
4. Start the backend server:
   ```bash
   npm run dev
   ```

### 3. Frontend Setup

1. Open a **new** terminal window and navigate into the `client` folder:
   ```bash
   cd client
   ```
2. Install all the frontend packages:
   ```bash
   npm install
   ```
3. Create a `.env.local` file in the `client` folder:
   ```env
   VITE_BACKEND_URL=http://localhost:7777
   ```
4. Start the frontend website:
   ```bash
   npm run dev
   ```
   Your browser will automatically open to `http://localhost:5173` and you can start using LinkUp!

---

## 🌍 Production Deployment

This app is 100% production ready and designed to be hosted!

- **Frontend Hosting:** We recommend deploying the `client` folder to **[Vercel](https://vercel.com/)**.
- **Backend Hosting:** We recommend deploying the `server` folder to **[Render](https://render.com/)**.

_Note: Make sure to update the Vercel and Render Environment Variables so `VITE_BACKEND_URL` and `FRONTEND_URL` point to your live, hosted URL links instead of localhost!_

---

## 🐛 Bug Fixes & Learnings

As we built this project and took it to production, we encountered and fixed several complex bugs related to Cross-Site Cookies, MongoDB ID filtering, and Database Indexing.

If you are a beginner developer and want to learn exactly how we solved them, please read our simple [Error_Fixed.md](./Error_Fixed.md) guide!

---

_Created with ❤️ by Ranvendra_
