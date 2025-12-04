const express = require("express");
const searchRouter = express.Router();
const { userAuth } = require("../middlewares/userauth");
const User = require("../models/user");
const ConnectionRequest = require("../models/connectionRequest");

searchRouter.get("/search", userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;

        const page = parseInt(req.query.page) || 1;
        let limit = parseInt(req.query.limit) || 8;
        limit = limit > 50 ? 50 : limit;
        const skip = (page - 1) * limit;

        // Filtering
        const { search, gender, ageRange, skills } = req.query;
        const filter = {
            _id: { $ne: loggedInUser._id },
        };

        if (search) {
            filter.$or = [
                { firstName: { $regex: search, $options: "i" } },
                { lastName: { $regex: search, $options: "i" } },
                { name: { $regex: search, $options: "i" } },
                { about: { $regex: search, $options: "i" } },
            ];
        }

        if (gender) {
            filter.gender = gender;
        }

        if (ageRange) {
            const today = new Date();
            let minAge, maxAge;

            switch (ageRange) {
                case "<20":
                    maxAge = 20;
                    break;
                case "20-30":
                    minAge = 20;
                    maxAge = 30;
                    break;
                case "30-40":
                    minAge = 30;
                    maxAge = 40;
                    break;
                case "40-50":
                    minAge = 40;
                    maxAge = 50;
                    break;
                case "50-60":
                    minAge = 50;
                    maxAge = 60;
                    break;
                case ">60":
                    minAge = 60;
                    break;
            }

            if (minAge !== undefined) {
                const maxDate = new Date(
                    today.getFullYear() - minAge,
                    today.getMonth(),
                    today.getDate()
                );
                filter.dateOfBirth = { ...filter.dateOfBirth, $lte: maxDate };
            }
            if (maxAge !== undefined) {
                const minDate = new Date(
                    today.getFullYear() - maxAge - 1,
                    today.getMonth(),
                    today.getDate()
                );
                filter.dateOfBirth = { ...filter.dateOfBirth, $gt: minDate };
            }
        }

        if (skills) {
            const skillsArray = skills.split(",");
            filter.skills = { $in: skillsArray };
        }

        // Sorting
        const sort = {};
        if (req.query.sort) {
            if (req.query.sort === "asc") {
                sort.name = 1;
            } else if (req.query.sort === "desc") {
                sort.name = -1;
            }
        } else {
            sort.createdAt = -1;
        }

        // Get total count for pagination
        const totalUsers = await User.countDocuments(filter);

        const users = await User.find(filter)
            .select("name firstName lastName photoUrl profilePicture age gender about interests dateOfBirth")
            .skip(skip)
            .limit(limit)
            .sort(sort)
            .collation({ locale: "en", strength: 2, numericOrdering: true });

        // Fetch all connection requests involving logged-in user
        const connectionRequests = await ConnectionRequest.find({
            $or: [
                { fromUserId: loggedInUser._id },
                { toUserId: loggedInUser._id }
            ]
        });

        // Create a map of userId to connection status
        const connectionStatusMap = {};
        connectionRequests.forEach(request => {
            const otherUserId = request.fromUserId.equals(loggedInUser._id)
                ? request.toUserId.toString()
                : request.fromUserId.toString();

            connectionStatusMap[otherUserId] = {
                status: request.status,
                requestedBy: request.fromUserId.equals(loggedInUser._id) ? 'me' : 'them'
            };
        });

        // Add connection status to each user
        const usersWithStatus = users.map(user => {
            const userObj = user.toObject();
            const connectionInfo = connectionStatusMap[user._id.toString()];

            if (!connectionInfo) {
                userObj.connectionStatus = 'none';
            } else if (connectionInfo.status === 'accepted') {
                userObj.connectionStatus = 'connected';
            } else if (connectionInfo.status === 'interested') {
                userObj.connectionStatus = 'pending';
            } else {
                // For 'ignored' or 'rejected', treat as 'none' so they can reconnect
                userObj.connectionStatus = 'none';
            }

            // Calculate age if dateOfBirth exists
            if (userObj.dateOfBirth) {
                const dob = new Date(userObj.dateOfBirth);
                const today = new Date();
                let age = today.getFullYear() - dob.getFullYear();
                const m = today.getMonth() - dob.getMonth();
                if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
                    age--;
                }
                userObj.age = age;
            }

            return userObj;
        });

        res.json({
            data: usersWithStatus,
            page,
            limit,
            totalPages: Math.ceil(totalUsers / limit),
            totalUsers
        });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

module.exports = searchRouter;
