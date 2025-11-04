require('dotenv').config();

const express = require("express");
const app = express();
const connectDB = require("./config/database");
const User = require("./models/user")

const PORT = process.env.PORT || 3000;

app.use(express.json())

app.post("/signup", async (req, res) => {

  // creating new instance of the model "User"

  const data = new User(req.body);
  console.log(req.body)

  try {
    await data.save();
    res.send("User Added Successfully.")
  }
  catch (err) {
    res.status(400).send(`Something Went Wrong:${err.message}`)
  }
})

app.get("/test", async(req, res)=> {

  try {
    res.json({"Message": "Hello!, Welcome to the world of Backend."})
  }
  catch(err){
    res.status(500).json({"message": err.message})
  }
})

app.get("/", async(req, res)=> {

  try {
    res.json({"Note": "It's Ranvendra Pratap Singh's Server. You are noticed to stay away from this"})
  }
  catch(err){
    res.status(500).json({"message": err.message})
  }
})

connectDB()
  .then(() => {
    console.log("Database Connection Established.")
    app.listen(PORT, () => {
      console.log("Server is listening on the port 3000...")
    })
  })
  .catch((err) => {
    console.error("Database Can Not Be Connected.");
  });
