// creating express router
const express = require("express");
const authRouter = express.Router();
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { ValidateSignupData } = require("../utils/validation");

// router and app logic almost the same way.

// Signup aPI

authRouter.post("/signup", ValidateSignupData, async (req, res) => {
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
    res.status(201).json({
      success: true,
      message: "User registered successfully. Please login to continue.",
      user: {
        name: name,
        email: email,
      },
    });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Email already exists. Please use a different email.",
      });
    }
    res.status(500).json({
      success: false,
      message: "Something went wrong: " + err.message,
    });
  }
});

// Login Api

authRouter.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required.",
      });
    }

    const user = await User.findOne({ email: email });

    // do not give extra information to the attacker.
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    // compare password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(400).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    // Creating Jwt token.
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    // Add the token to the cookie, and send it to the client with the response.
    const isProduction =
      process.env.NODE_ENV === "production" ||
      (process.env.FRONTEND_URL &&
        (process.env.FRONTEND_URL.includes("vercel.app") ||
          process.env.FRONTEND_URL.includes("render.com")));

    res.cookie("LinkupToken", token, {
      httpOnly: true, // Prevent client-side JS access
      secure: isProduction, // Secure in production (HTTPS)
      sameSite: isProduction ? "None" : "Lax", // None for cross-site in production
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return res.status(200).json({
      success: true,
      message: "Login successful! Welcome back.",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
      },
      token: token,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Server error: " + err.message,
    });
  }
});

// Logout api
authRouter.post("/logout", async (req, res) => {
  try {
    res.clearCookie("LinkupToken");
    return res.status(200).json({
      success: true,
      message: "Logged out successfully.",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Server error: " + err.message,
    });
  }
});

module.exports = authRouter;
