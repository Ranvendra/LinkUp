# LinkUp Project: Errors Fixed Guide

Welcome! This guide is written in very simple English to help any beginner developer understand exactly what went wrong in the code, why it went wrong, and the simple logic used to fix it.

---

## 1. The "Redirect to Login" Bug (Cross-Site Cookies)

### What was happening?

When you successfully logged in on your live Vercel website `linkupweb.vercel.app`, the Render backend `linkup-ulyr.onrender.com` sent back a "Cookie" containing your login token. But instead of letting you see the Feed page, the website immediately kicked you back out to the Signup page!

### Why did this happen?

Modern web browsers (like Safari and Google Chrome) have strict "Privacy" and "Anti-Tracking" features. Because your frontend (Vercel) and backend (Render) are on **two completely different domains**, the browser thought the Cookie was a tracker and **Blocked** it. Since the Cookie was blocked, the very next API request had no login token, so the backend said "You are not logged in!"

### How we fixed it:

We updated your frontend API code. If the browser blocks the cookie, we grab a backup copy of the token from the browser's `localStorage` and manually attach it to every single request as an `Authorization` header.

**Code Changed (`client/src/services/api.js`):**

```javascript
// We added this "Interceptor". It intercepts every request before it leaves your computer.
api.interceptors.request.use(
  (config) => {
    // 1. Get the backup token
    const token = localStorage.getItem("token");

    // 2. If we have a token, tape it to the 'Authorization' header of the request
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);
```

---

## 2. The Potential Server Crash (Typo in Mongoose)

### What was happening?

The whole backend Node.js server could suddenly crash and go offline.

### Why did this happen?

In your mongoose `user.js` model for the Profile Picture, you wrote logic to check if a URL is valid. If the URL was bad, you wanted to throw an error message. But you wrote `throw new error(...)` with a lowercase `e`. In JavaScript, `Error` must always start with a capital `E`. Because `error` with a lowercase `e` does not exist, Node.js gets confused and crashes the whole server!

### How we fixed it:

We simply changed the lowercase `e` to a capital `E`.

**Code Changed (`server/src/models/user.js`):**

```javascript
// Old Code
if (!validator.isURL(value)) {
  throw new error(`${value} is not a valid URL.`); // Bug!
}

// New Code
if (!validator.isURL(value)) {
  throw new Error(`${value} is not a valid URL.`); // Fixed!
}
```

---

## 3. The Slow Signup Bug (Database Locking)

### What was happening?

When your app grows to thousands of users, signing up a new user would become slower and slower, eventually freezing the database.

### Why did this happen?

Inside your `/signup` code, you used the command `await User.syncIndexes();`. This command tells MongoDB to rebuild and reorganize all of its search indexes. This is a very heavy, slow task. It should only be run once when the server starts. Running it every single time a totally new user signs up pauses the database!

### How we fixed it:

We deleted that line of code from the signup route.

**Code Changed (`server/src/routes/auth.js`):**

```javascript
// Old Code
authRouter.post("/signup", ValidateSignupData, async (req, res) => {
  await User.syncIndexes(); // This is the heavy, slow task!
  const { name, dateOfBirth, email, password } = req.body;
  ...
});

// New Code (Line deleted)
authRouter.post("/signup", ValidateSignupData, async (req, res) => {
  const { name, dateOfBirth, email, password } = req.body;
  ...
});
```

---

## 4. Seeing Yourself in the Feed (Data Type Bug)

### What was happening?

When you went to the Feed or Search page, your own profile picture was showing up alongside other users.

### Why did this happen?

In your backend `feed.js` file, you created a filter to hide the currently logged-in user. You put all the IDs into a Javascript `Set` data structure (which turns them into plain Strings/Text) and then tried to match your User ID (which is a special MongoDB `ObjectId` object).
JavaScript could not recognize that the Object matched the Text String, so the filter failed to hide you!

### How we fixed it:

We converted your MongoDB Object ID into a plain text String by simply typing `.toString()`. Now the code can properly identify and hide your profile.

**Code Changed (`server/src/routes/feed.js`):**

```javascript
// Old Code
// Trying to blend Strings with an Object
filter._id = { $nin: Array.from(hideUsersFromFeed).concat(loggedInUser._id) };

// New Code
// Turned the object into a String so everything matches!
filter._id = {
  $nin: Array.from(hideUsersFromFeed).concat(loggedInUser._id.toString()),
};
```

---

## 5. Only Messaging Connections (Blocking Feature)

### What was happening?

Users wanted to message anyone globally, but the app rejected messaging anyone who wasn't on the "Connections" list.

### Why did this happen?

In your `chat.js` setup, there was a strict security wall. Before creating a chat, the backend searched the Database to see if an "Accepted" connection request existed between the two users. If it didn't find one, it threw a `403 Error`.

### How we fixed it:

We simply deleted the security wall code! Now, any user can start a chat with any target user. On top of this, we added a new "Message" button right onto the Search cards on the frontend so users can easily click it!

**Code Changed (`server/src/routes/chat.js`):**

```javascript
// Old Code (The Security Wall)
const connection = await ConnectionRequest.findOne({
  $or: [
    { fromUserId: userId, toUserId: targetUserId, status: "accepted" },
    { fromUserId: targetUserId, toUserId: userId, status: "accepted" },
  ],
});

if (!connection) {
  return res
    .status(403)
    .json({ message: "You can only chat with your connections" });
}

// New Code
// We completely deleted the code above! Now it just skips straight to opening the chat.
```
