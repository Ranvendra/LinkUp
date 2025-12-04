const express = require("express");
const requestRouter = express.Router();

const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");
const { userAuth } = require("../middlewares/userauth");

// Send Connection Request
requestRouter.post(
  "/request/send/:status/:toUserId",
  userAuth,
  async (req, res) => {
    try {
      const fromUserId = req.user._id;
      const toUserId = req.params.toUserId;
      const status = req.params.status;

      const allowedStatus = ["ignored", "interested"];
      if (!allowedStatus.includes(status)) {
        return res
          .status(400)
          .json({ message: "Invalid status type: " + status });
      }

      const toUser = await User.findById(toUserId);
      if (!toUser) {
        return res.status(404).json({ message: "User not found!" });
      }

      const existingConnectionRequest = await ConnectionRequest.findOne({
        $or: [
          { fromUserId, toUserId },
          { fromUserId: toUserId, toUserId: fromUserId },
        ],
      });

      if (existingConnectionRequest) {
        if (existingConnectionRequest.status === "accepted") {
          return res
            .status(400)
            .json({ message: "Connection Already Exists!!" });
        }

        if (existingConnectionRequest.status === "interested") {
          return res
            .status(400)
            .json({ message: "Connection Request Already Exists!!" });
        }

        // If status is "ignored" or "rejected", we delete the old request
        // and allow creating a new one
        await ConnectionRequest.findByIdAndDelete(existingConnectionRequest._id);
      }

      const connectionRequest = new ConnectionRequest({
        fromUserId,
        toUserId,
        status,
      });

      const data = await connectionRequest.save();

      res.json({
        message:
          req.user.name + " is " + status + " in " + toUser.name,
        data,
      });
    } catch (err) {
      res.status(400).send("ERROR: " + err.message);
    }
  }
);

// Get received connection requests
requestRouter.get(
  "/user/requests/received",
  userAuth,
  async (req, res) => {
    try {
      const loggedInUser = req.user;

      const connectionRequests = await ConnectionRequest.find({
        toUserId: loggedInUser._id,
        status: "interested",
      }).populate(
        "fromUserId",
        "name firstName lastName photoUrl profilePicture about gender age"
      );

      res.json({
        message: "Data fetched successfully",
        data: connectionRequests,
      });
    } catch (err) {
      res.status(400).send("ERROR: " + err.message);
    }
  }
);

// Review connection request (accept/reject)
requestRouter.post(
  "/request/review/:status/:requestId",
  userAuth,
  async (req, res) => {
    try {
      const loggedInUser = req.user;
      const { status, requestId } = req.params;

      const allowedStatus = ["accepted", "rejected"];
      if (!allowedStatus.includes(status)) {
        return res.status(400).json({ message: "Status not allowed!" });
      }

      const connectionRequest = await ConnectionRequest.findOne({
        _id: requestId,
        toUserId: loggedInUser._id,
        status: "interested",
      });

      if (!connectionRequest) {
        return res
          .status(404)
          .json({ message: "Connection request not found" });
      }

      connectionRequest.status = status;

      const data = await connectionRequest.save();

      res.json({ message: "Connection request " + status, data });
    } catch (err) {
      res.status(400).send("ERROR: " + err.message);
    }
  }
);

// Get all accepted connections (for chat)
requestRouter.get("/user/connections", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const connections = await ConnectionRequest.find({
      $or: [
        { fromUserId: loggedInUser._id, status: "accepted" },
        { toUserId: loggedInUser._id, status: "accepted" },
      ],
    })
      .populate("fromUserId", "name firstName lastName photoUrl profilePicture about gender age")
      .populate("toUserId", "name firstName lastName photoUrl profilePicture about gender age");

    // Transform to return just the connected users
    const connectedUsers = connections.map((conn) => {
      if (conn.fromUserId._id.toString() === loggedInUser._id.toString()) {
        return conn.toUserId;
      } else {
        return conn.fromUserId;
      }
    });

    res.json({
      message: "Connections fetched successfully",
      data: connectedUsers,
    });
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
});

// Remove connection
requestRouter.delete("/request/remove/:userId", userAuth, async (req, res) => {
  try {
    const loggedInUserId = req.user._id;
    const targetUserId = req.params.userId;

    // 1. Find and delete the connection request
    const connection = await ConnectionRequest.findOneAndDelete({
      $or: [
        { fromUserId: loggedInUserId, toUserId: targetUserId, status: "accepted" },
        { fromUserId: targetUserId, toUserId: loggedInUserId, status: "accepted" },
      ],
    });

    if (!connection) {
      return res.status(404).json({ message: "Connection not found" });
    }

    // 2. Find the chat between these users
    const Chat = require("../models/chat");
    const Message = require("../models/message");

    const chat = await Chat.findOne({
      participants: { $all: [loggedInUserId, targetUserId] },
    });

    if (chat) {
      // 3. Delete the chat and its messages
      await Chat.findByIdAndDelete(chat._id);
      await Message.deleteMany({ chatId: chat._id });
    }

    res.json({ message: "Connection and chat history removed successfully" });
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
});

module.exports = requestRouter;