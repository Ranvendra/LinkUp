const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      trim: true,
      minLength: 3,
      maxLength: 10,
    },
    name: {
      type: String,
      required: true,
      trim: true,
      minLength: 3,
      maxLength: 30,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      validator(value) {
        if (!validator.isEmail(value)) {
          throw new Error(`Invalid Email: ${value} Address.`);
        }
      },
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      trim: true,
      minLength: 5,
      maxLength: 500,
    },
    dateOfBirth: {
      type: Date,
      required: true,
      trim: true,
    },
    gender: {
      type: String,
      validate(value) {
        if (!["Male", "Female", "thers"].includes(value)) {
          throw new Error(
            "Gender is not valid. It should be among male, female and others"
          );
        }
      },
      trim: true,
      minLength: 4,
      maxLength: 5,
    },
    profilePicture: {
      type: String,
      default:
        "https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_640.png",
      trim: true,
      validator(value) {
        if (!validator.isURL(value)) {
          throw new error(`${value} is not a valid URL.`);
        }
      },
    },
    interests: {
      type: [String],
      trim: true,
    },
    about: {
      type: String,
      trim: true,
      minLength: 10,
      maxLength: 100,
    },
  },
  { timestamps: true }
);

const userModel = mongoose.model("User", userSchema);
module.exports = userModel;
