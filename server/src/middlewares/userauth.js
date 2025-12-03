const jwt = require("jsonwebtoken");
const User = require("../models/user");

const userAuth = async (req, res, next) => {
  //read the cookies

  try {
    // Check for token in cookies or Authorization header
    const { LinkupToken } = req.cookies;
    const authHeader = req.headers['authorization'];

    let token = LinkupToken;

    if (!token && authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    }

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
    res.status(401).send("ERROR: " + err.message);
  }
};




module.exports = {
  userAuth,
};
