const mongoose = require('mongoose');
const User = require('./src/models/user');

const run = async () => {
    try {
        await mongoose.connect('mongodb+srv://namastedev:Namastedev@namastenode.b6w7k.mongodb.net/devTinder');

        const users = await User.find({});
        console.log("Checking users...");
        users.forEach(u => {
            console.log(`ID: ${u._id}, Name: ${u.firstName} ${u.lastName}, Raw: ${JSON.stringify(u)}`);
        });

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

run();
