const express = require('express');
const requestRouter = express.Router();
const { userAuth } = require("../middlewares/userauth");

// sending connection request:
requestRouter.post("/sendConnectionRequest", userAuth, async (req, res) => {
  const user = req.user;
  return res.send(user.name + " would like to connect with you.");
});

module.exports = requestRouter;