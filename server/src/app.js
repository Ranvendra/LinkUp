require("dotenv").config();

const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const cors = require("cors");
const connectDB = require("./config/database");

const PORT = process.env.PORT || 7777;

// CoRS ConfFIGUuration
const corsOptions = {
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

// Middlewares
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Importing RouTers;
const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/requests");


// routers
app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);




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

connectDB()
  .then(() => {
    console.log("Database Connection Established.");
    app.listen(PORT, () => {
      console.log(`Server is listening on the port ${PORT}...`);
    });
  })
  .catch((err) => {
    console.error("Database Can Not Be Connected.");
  });
