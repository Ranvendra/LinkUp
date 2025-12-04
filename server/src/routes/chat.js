const express = require("express");
const chatRouter = express.Router();
const { userAuth } = require("../middlewares/userauth");
const Chat = require("../models/chat");
const Message = require("../models/message");
const User = require("../models/user");

// Get all chats for the logged-in user
chatRouter.get("/chat", userAuth, async (req, res) => {
    try {
        const userId = req.user._id;
        const chats = await Chat.find({ participants: userId })
            .populate({
                path: "participants",
                select: "name firstName lastName photoUrl profilePicture",
            })
            .populate({
                path: "latestMessage",
                select: "content sender createdAt",
            })
            .sort({ updatedAt: -1 });

        // Calculate unread count for each chat
        const chatsWithUnreadCount = await Promise.all(
            chats.map(async (chat) => {
                const unreadCount = await Message.countDocuments({
                    chatId: chat._id,
                    sender: { $ne: userId }, // Message not sent by me
                    readBy: { $ne: userId }, // Not read by me
                });
                return { ...chat.toObject(), unreadCount };
            })
        );

        // Filter out chats where participants are missing (deleted users)
        const validChats = chatsWithUnreadCount.filter((chat) => {
            return (
                chat.participants &&
                chat.participants.length === 2 &&
                chat.participants.every((p) => p !== null)
            );
        });

        res.json({ message: "Chats fetched successfully", data: validChats });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Get messages for a specific chat
chatRouter.get("/chat/:chatId", userAuth, async (req, res) => {
    try {
        const chatId = req.params.chatId;
        const messages = await Message.find({ chatId })
            .populate("sender", "name firstName lastName photoUrl profilePicture")
            .sort({ createdAt: 1 });

        res.json({ message: "Messages fetched successfully", data: messages });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Create or Get Chat with a user
chatRouter.post("/chat/:targetUserId", userAuth, async (req, res) => {
    try {
        const { targetUserId } = req.params;
        const userId = req.user._id;

        // Check if users are connected
        const ConnectionRequest = require("../models/connectionRequest");
        const connection = await ConnectionRequest.findOne({
            $or: [
                { fromUserId: userId, toUserId: targetUserId, status: "accepted" },
                { fromUserId: targetUserId, toUserId: userId, status: "accepted" },
            ],
        });

        if (!connection) {
            return res.status(403).json({ message: "You can only chat with your connections" });
        }

        let chat = await Chat.findOne({
            participants: { $all: [userId, targetUserId] },
        });

        if (!chat) {
            chat = new Chat({
                participants: [userId, targetUserId],
            });
            await chat.save();
        }

        await chat.populate("participants", "name firstName lastName photoUrl profilePicture");

        res.json({ message: "Chat initiated", data: chat });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Mark messages as read (PUT API 1)
chatRouter.put("/chat/read/:chatId", userAuth, async (req, res) => {
    try {
        const { chatId } = req.params;
        const userId = req.user._id;

        await Message.updateMany(
            {
                chatId,
                sender: { $ne: userId },
                readBy: { $ne: userId },
            },
            {
                $addToSet: { readBy: userId },
            }
        );

        res.json({ message: "Messages marked as read" });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Delete Chat
chatRouter.delete("/chat/:chatId", userAuth, async (req, res) => {
    try {
        const { chatId } = req.params;
        await Chat.findByIdAndDelete(chatId);
        await Message.deleteMany({ chatId });
        res.json({ message: "Chat deleted successfully" });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Delete Message
chatRouter.delete("/message/:messageId", userAuth, async (req, res) => {
    try {
        const { messageId } = req.params;
        await Message.findByIdAndDelete(messageId);
        res.json({ message: "Message deleted successfully" });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Update Message (Edit) (PUT API 2)
chatRouter.put("/chat/message/:messageId", userAuth, async (req, res) => {
    try {
        const { messageId } = req.params;
        const { content } = req.body;

        const message = await Message.findById(messageId);
        if (!message) {
            return res.status(404).json({ message: "Message not found" });
        }

        if (message.sender.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Not authorized to edit this message" });
        }

        message.content = content;
        await message.save();
        await message.populate("sender", "name firstName lastName photoUrl profilePicture");

        res.json({ message: "Message updated successfully", data: message });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

module.exports = chatRouter;
