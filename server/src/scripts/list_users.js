const mongoose = require('mongoose');
const User = require('../models/user');
require('dotenv').config({ path: __dirname + '/../../.env' });

const run = async () => {
    try {
        const dbURI = process.env.MONGO_URI;
        if (!dbURI) {
            console.error("MONGO_URI is undefined");
            process.exit(1);
        }
        await mongoose.connect(dbURI);
        console.log("Connected to DB. Listing Users:");

        const users = await User.find({});
        if (users.length === 0) {
            console.log("No users found in database.");
        } else {
            console.log("--------------------------------------------------");
            users.forEach(u => {
                console.log(`ID: ${u._id}`);
                console.log(`Name: ${u.name}`);
                console.log(`Email: ${u.email}`);
                console.log("--------------------------------------------------");
            });
        }
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

run();
