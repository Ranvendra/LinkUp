# Linkup – Developer Connection Platform 🚀

![Linkup Banner](https://via.placeholder.com/1200x300?text=Linkup+-+Connect+with+Developers)

## 1. About the Project

**Linkup** is a specialized social platform designed for developers to connect, collaborate, and network. Think of it as **"Tinder for Coders"**. Users can create detailed profiles showcasing their skills, search for peers with specific tech stacks, communicate via real-time chat, and build meaningful professional connections.

## 2. Problem Statement

In the vast world of software development, finding peers with similar interests or complementary skills can be challenging. General social networks are too broad, and professional networks like LinkedIn can feel too formal. **Linkup** solves this by providing a dedicated space for developers to:

- Find coding partners.
- Discuss technologies.
- Network in a community that "speaks code".

## 3. Core Features 🌟

- **Secure Authentication**: JWT-based Signup/Login with password encryption (Bcrypt).
- **Advanced Developer Search**: Filter users by name, skills, gender, or age range.
- **Smart Feed**: Pagination and dynamic filtering exclude existing connections.
- **Connection Management**:
  - Send "Interested" or "Ignored" status requests.
  - Review received requests (Accept/Reject).
  - Manage active connections.
- **Real-time Chat**: WebSocket-powered messaging for connected users.
- **Profile Management**: customizable profiles with skills, bio, and photo URLs.
- **Responsive UI**: Built with React and TailwindCSS for all devices.

## 4. Tech Stack 🛠️

| Category       | Technology                           |
| -------------- | ------------------------------------ |
| **Frontend**   | React.js, TailwindCSS, Redux Toolkit |
| **Backend**    | Node.js, Express.js                  |
| **Database**   | MongoDB (Mongoose ODM)               |
| **Auth**       | JWT, HttpOnly Cookies, BCrypt        |
| **Real-time**  | Socket.io                            |
| **Deployment** | Vercel (Frontend), Render (Backend)  |

## 5. System Architecture 🏗️

The application follows a standard **MERN Stack** architecture:

```mermaid
graph LR
    A[Frontend (React)] <-->|REST API| B[Backend API (Node/Express)]
    B <-->|Mongoose| C[(MongoDB Atlas)]
    A <-->|Socket.io| B
```

## 6. Database Keys 🗄️

### User Model

- **Basic Info**: `firstName`, `lastName`, `email`, `password`, `age`, `gender`.
- **Profile**: `photoUrl`, `about`, `skills` (Array of Strings).

### Connection Request Model

- **fromUserId**: Reference to Sender.
- **toUserId**: Reference to Receiver.
- **status**: Enum [`ignored`, `interested`, `accepted`, `rejected`].

## 7. API Reference 🔌

### Authentication

| Method | Endpoint  | Description              |
| ------ | --------- | ------------------------ |
| `POST` | `/signup` | Register a new user      |
| `POST` | `/login`  | Login and receive cookie |
| `POST` | `/logout` | Clear auth cookie        |

### Profile

| Method   | Endpoint            | Description                |
| -------- | ------------------- | -------------------------- |
| `GET`    | `/profile/view`     | Get logged-in user details |
| `PATCH`  | `/profile/edit`     | Update profile fields      |
| `PATCH`  | `/profile/password` | Change password            |
| `DELETE` | `/profile/delete`   | Delete account             |

### Feed & Users

| Method | Endpoint | Description                                                                  |
| ------ | -------- | ---------------------------------------------------------------------------- |
| `GET`  | `/feed`  | Get user feed with filters (`page`, `limit`, `search`, `skills`, `ageRange`) |

### Connections

| Method   | Endpoint                             | Description                           |
| -------- | ------------------------------------ | ------------------------------------- |
| `POST`   | `/request/send/:status/:toUserId`    | Send request (`interested`/`ignored`) |
| `GET`    | `/user/requests/received`            | Get pending received requests         |
| `POST`   | `/request/review/:status/:requestId` | Accept or Reject a request            |
| `GET`    | `/user/connections`                  | Get all connected users               |
| `DELETE` | `/request/remove/:userId`            | Remove connection & chat history      |

## 8. Getting Started 💻

Follow these instructions to get a copy of the project up and running on your local machine.

### Prerequisites

- Node.js (v16+)
- MongoDB (Running locally or Atlas URI)
- Git

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/yourusername/linkup.git
   cd linkup
   ```

2. **Setup Backend**

   ```bash
   cd server
   npm install
   ```

   Create a `.env` file in the `server` directory:

   ```env
   PORT=7777
   DB_CONNECTION_STRING=your_mongodb_atlas_url
   JWT_SECRET=your_super_secret_key
   FRONTEND_URL=http://localhost:5173
   NODE_ENV=development
   ```

   Start the server:

   ```bash
   npm run dev
   ```

3. **Setup Frontend**
   Open a new terminal and navigate to the client folder:

   ```bash
   cd client
   npm install
   ```

   Create a `.env` file in the `client` directory:

   ```env
   VITE_BACKEND_URL=http://localhost:7777
   ```

   Start the application:

   ```bash
   npm run dev
   ```

4. **Access the App**
   Open your browser and navigate to `http://localhost:5173`.

---

**Note**: This project implements strict CORS policies. Ensure your frontend and backend ports match the `.env` configurations.
