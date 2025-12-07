const mongoose = require('mongoose');
const User = require('../models/user');
const ConnectionRequest = require('../models/connectionRequest');
const Chat = require('../models/chat');
const Message = require('../models/message');
require('dotenv').config({ path: __dirname + '/../../.env' }); // Adjust path to .env

// Mocking the delete logic from server/src/routes/requests.js
const removeConnectionLogic = async (loggedInUserId, targetUserId) => {
    console.log(`\n--- Executing Remove Connection Logic between ${loggedInUserId} and ${targetUserId} ---`);

    // 1. Find and delete the connection request
    const connection = await ConnectionRequest.findOneAndDelete({
        $or: [
            { fromUserId: loggedInUserId, toUserId: targetUserId, status: "accepted" },
            { fromUserId: targetUserId, toUserId: loggedInUserId, status: "accepted" },
        ],
    });

    if (!connection) {
        console.log("Connection Request not found.");
        return; // Fixed logic returns early if not found
    } else {
        console.log("Connection Request deleted.");
    }

    // 2. Find the chat between these users
    const chat = await Chat.findOne({
        participants: { $all: [loggedInUserId, targetUserId] },
    });

    if (chat) {
        console.log(`Chat found: ${chat._id}. Deleting chat and messages (HISTORY ONLY)...`);
        // 3. Delete the chat and its messages (Only history is removed, NOT users)
        await Chat.findByIdAndDelete(chat._id);
        await Message.deleteMany({ chatId: chat._id });
        console.log("Chat and messages deleted.");
    } else {
        console.log("No chat found between users.");
    }
    console.log("--- Remove Connection Logic Completed ---\n");
};

const run = async () => {
    try {
        // Load env vars
        const dbURI = process.env.MONGO_URI;
        if (!dbURI) {
            console.error("MONGO_URI is undefined. Check .env file.");
            process.exit(1);
        }
        console.log(`Attempting to connect to DB (URI length: ${dbURI.length})...`);

        await mongoose.connect(dbURI);
        console.log("Connected to DB");

        // 1. Setup Test Users
        console.log("Creating test users...");
        const userA = new User({
            name: "TestUser A",
            email: "testuserA_" + Date.now() + "@example.com",
            password: "Password@123",
            dateOfBirth: new Date(),
            gender: "Male",
            profilePicture: "https://example.com/a.jpg"
        });
        const userB = new User({
            name: "TestUser B",
            email: "testuserB_" + Date.now() + "@example.com",
            password: "Password@123",
            dateOfBirth: new Date(),
            gender: "Female",
            profilePicture: "https://example.com/b.jpg"
        });

        await userA.save();
        await userB.save();
        console.log(`Created User A: ${userA._id}`);
        console.log(`Created User B: ${userB._id}`);

        // 2. Create Connection
        console.log("Creating connection...");
        const conn = new ConnectionRequest({
            fromUserId: userA._id,
            toUserId: userB._id,
            status: "accepted"
        });
        await conn.save();

        // 3. Create Chat
        console.log("Creating chat...");
        const chat = new Chat({
            participants: [userA._id, userB._id]
        });
        await chat.save();

        const msg = new Message({
            chatId: chat._id,
            sender: userA._id,
            content: "Hello B"
        });
        await msg.save();


        // --- TEST 1: Remove Connection ---
        console.log("TEST 1: Removing connection (Simulating 'Remove Connection' button)");
        await removeConnectionLogic(userA._id, userB._id);

        // Verify Users still exist
        const checkUserA = await User.findById(userA._id);
        const checkUserB = await User.findById(userB._id);

        if (!checkUserA) console.error("CRITICAL DELETE ERROR: User A is missing!");
        else console.log("User A exists.");

        if (!checkUserB) console.error("CRITICAL DELETE ERROR: User B is missing!");
        else console.log("User B exists.");

        if (checkUserA && checkUserB) {
            console.log("SUCCESS: Removing connection did NOT delete users.");
        } else {
            console.log("FAILURE: One or both users were deleted.");
        }


        // --- TEST 2: Delete Account ---
        // Let's create a User C connected to User A, then delete User A, and see if User C survives.
        console.log("\nTEST 2: Delete Account");
        const userC = new User({
            name: "TestUser C",
            email: "testuserC_" + Date.now() + "@example.com",
            password: "Password@123",
            dateOfBirth: new Date(),
            gender: "Male"
        });
        await userC.save();
        console.log(`Created User C: ${userC._id}`);

        // Logic from server/src/routes/profile.js
        // profileRouter.delete("/profile/delete", ... ) -> await user.deleteOne();
        console.log(`Deleting User A (${userA._id})...`);
        await User.deleteOne({ _id: userA._id });
        // Note: The actual route uses user.deleteOne() on the document instance found by req.user. 
        // Using Model.deleteOne({_id: ...}) is effectively the same for the DB.

        const checkUserA_Again = await User.findById(userA._id);
        const checkUserC = await User.findById(userC._id);

        if (checkUserA_Again) console.error("User A was NOT deleted.");
        else console.log("User A deleted as expected.");

        if (checkUserC) console.log("User C exists. SUCCESS.");
        else console.error("CRITICAL DELETE ERROR: User C was deleted along with User A!");

        // CLEANUP
        console.log("\nCleaning up test users...");
        if (checkUserB) await User.deleteOne({ _id: userB._id });
        if (checkUserC) await User.deleteOne({ _id: userC._id });

    } catch (err) {
        console.error("An error occurred:", err);
    } finally {
        await mongoose.disconnect();
        process.exit(0);
    }
};

run();
