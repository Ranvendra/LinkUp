const validator = require("validator");
const User = require("../models/user");

const ValidateSignupData = async (req, res, next) => {
  const { name, dateOfBirth, email, password } = req.body;

  if (!name || !dateOfBirth || !email || !password) {
    return res.status(400).json({
      success: false,
      message: "All fields are required.",
    });
  }

  if (!validator.isEmail(email)) {
    return res.status(400).json({
      success: false,
      message: "Please enter a valid email address.",
    });
  }

  if (!validator.isStrongPassword(password)) {
    return res.status(400).json({
      success: false,
      message: "Password must contain uppercase, lowercase, numbers, and symbols.",
    });
  }

  const user = await User.findOne({ email: email });

  if (user) {
    return res.status(400).json({
      success: false,
      message: `Email "${email}" is already registered. Please use a different email or login.`,
    });
  }

  next();
};

const validateEditProfileData = async (req) => {
  const allowedEditFields = [
    "name",
    "password",
    "dateOfBirth",
    "gender",
    "profilePicture",
    "interests",
    "about",
  ];

  const isEditAllowed = Object.keys(req.body).every((fields)=> allowedEditFields.includes(fields))

  return isEditAllowed
}; 

module.exports = {
    ValidateSignupData,
    validateEditProfileData
};
