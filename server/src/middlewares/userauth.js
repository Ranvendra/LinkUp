const jwt = require("jsonwebtoken");
const User = require("../models/user");

const userAuth = async (req, res, next) => {
  //read the cookies

  try {
    const token = req.cookies.LinkupToken;

    if (!token) {
      throw new Error("Invalid Token");
    }
    const decodedObj = await jwt.verify(token, process.env.JWT_SECRET);

    const { _id } = decodedObj;

    const user = await User.findById(_id);

    if (!user) {
      throw new Error("You are not a valid user.");
    }

    req.user = user;

    next();
  } catch (err) {
    res.status(500).send("Error:"+ err.message);
  }
};




module.exports = {
  userAuth,
};
