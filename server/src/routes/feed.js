const express = require("express");
const feedRouter = express.Router();
const { userAuth } = require("../middlewares/userauth");
const User = require("../models/user");
const ConnectionRequest = require("../models/connectionRequest");

feedRouter.get("/feed", userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;

        const page = parseInt(req.query.page) || 1;
        let limit = parseInt(req.query.limit) || 10;
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
            // Assuming skills is a comma-separated string in query
            const skillsArray = skills.split(",");
            filter.skills = { $in: skillsArray };
        }


        // Exclude users with existing connections/requests
        const connectionRequests = await ConnectionRequest.find({
            $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }],
        }).select("fromUserId toUserId");

        const hideUsersFromFeed = new Set();
        connectionRequests.forEach((req) => {
            hideUsersFromFeed.add(req.fromUserId.toString());
            hideUsersFromFeed.add(req.toUserId.toString());
        });

        filter._id = { $nin: Array.from(hideUsersFromFeed).concat(loggedInUser._id) };


        // Sorting
        const sort = {};
        if (req.query.sort) {
            // Frontend sends "asc" for A-Z or "desc" for Z-A
            if (req.query.sort === "asc") {
                sort.firstName = 1;
            } else if (req.query.sort === "desc") {
                sort.firstName = -1;
            }
        } else if (req.query.sortBy) {
            const parts = req.query.sortBy.split(':');
            sort[parts[0]] = parts[1] === 'desc' ? -1 : 1;
        } else {
            sort.createdAt = -1; // Default sort
        }


        const users = await User.find(filter)
            .select("name firstName lastName photoUrl age gender about skills dateOfBirth")
            .skip(skip)
            .limit(limit)
            .sort(sort);

        res.json({ data: users, page, limit });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

module.exports = feedRouter;
