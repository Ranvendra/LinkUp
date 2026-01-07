require("dotenv").config();

const express = require("express");
const app = express();
const http = require("http");
const { Server } = require("socket.io");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const connectDB = require("./config/database");
const Message = require("./models/message");
const Chat = require("./models/chat");

const PORT = process.env.PORT || 7777;

// CoRS ConfFIGUuration
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "https://linkupweb.vercel.app",
  process.env.FRONTEND_URL,
].filter(Boolean);

const corsOptions = {
  origin: function (origin, callback) {
    console.log("Incoming Origin:", origin); // LOGGING ORIGIN
    if (!origin) return callback(null, true);

    // Check if origin matches any allowed origin
    const isAllowed = allowedOrigins.some(allowed => origin.startsWith(allowed));

    if (allowedOrigins.indexOf(origin) !== -1 || isAllowed) {
      console.log("Origin allowed:", origin);
      callback(null, origin);
    } else {
      console.error("CORS Blocked for origin:", origin);
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.set("trust proxy", 1); // Trust first proxy (Render/Vercel)

// Importing RouTers;
const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/requests");
const chatRouter = require("./routes/chat");
const feedRouter = require("./routes/feed");
const searchRouter = require("./routes/search");

// routers
app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", chatRouter);
app.use("/", feedRouter);
app.use("/", searchRouter);

// Testing purpose for server running.
app.get("/test", async (req, res) => {
  try {
    res.json({ Message: "Hello!, Welcome to the world of Backend." });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.get("/", async (req, res) => {
  try {
    res.json({
      Note: "It's Ranvendra Pratap Singh's Server. You are noticed to stay away from this",
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("A user connected: " + socket.id);

  socket.on("joinChat", ({ chatId }) => {
    socket.join(chatId);
    console.log(`User Joined Room: ${chatId}`);
  });

  socket.on("sendMessage", async ({ chatId, senderId, content }) => {
    try {
      const newMessage = new Message({
        chatId,
        sender: senderId,
        content,
      });
      await newMessage.save();

      // Update latest message in Chat
      await Chat.findByIdAndUpdate(chatId, { latestMessage: newMessage._id });

      const populatedMessage = await newMessage.populate(
        "sender",
        "name firstName lastName photoUrl"
      );

      io.to(chatId).emit("messageReceived", populatedMessage);
    } catch (err) {
      console.error("Error sending message:", err);
    }
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

connectDB()
  .then(() => {
    console.log("Database Connection Established.");
    server.listen(PORT, () => {
      console.log(`Server is listening on the port ${PORT}...`);
    });
  })
  .catch((err) => {
    console.error("Database Can Not Be Connected.");
  });

