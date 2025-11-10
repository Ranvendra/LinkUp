require("dotenv").config();

const express = require("express");
const app = express();
const connectDB = require("./config/database");
const User = require("./models/user");
const bcrypt = require("bcrypt");
const middleware = require("./utils/validation");

const PORT = process.env.PORT || 3000;
app.use(express.json());

// Signup Api

app.post("/signup", middleware.ValidateSignupData, async (req, res) => {
  await User.syncIndexes();

  const { name, dateOfBirth, email, password } = req.body;
  // hashing
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  // creating new instance of the model "User"
  const data = new User({
    name,
    dateOfBirth,
    email: email,
    password: hashedPassword,
  });

  try {
    await data.save();
    res.status(200).json({ 
      Message: "User Added Successfully.",
      user: {
        name: name,
        email: email,
        dateOfBirth: dateOfBirth,
        password: password,
      },
    });
  } catch (err) {
    res.status(400).send(`Something Went Wrong:${err.message}`);
  }
});

// Login Api

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email: email });

    // do not give extra information to the attacker.
    if (!user) {
      return res.status(400).send("Invalid credentials,");
    }

    // compare password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(400).send("Invalid credentials.");
    }

    return res.send("Login Successfully.");
  } catch (err) {
    res.status(500).send("Server Failed :", err.message);
  }
});

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
      console.log("Server is listening on the port 3000...");
    });
  })
  .catch((err) => {
    console.error("Database Can Not Be Connected.");
  });
