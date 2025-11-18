const express = require('express');
const profileRouter = express.Router();
const { userAuth } = require("../middlewares/userauth");
const {validateEditProfileData} = require("../utils/validation");

// Profile
profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    const user = req.user;
    return res.send(user);
  } catch (err) {
    return res.status(500).send("message:" + err.message);
  }
});


profileRouter.patch("profile/edit", userAuth, async(req, res)=> {

  try {

      const isEditAllowed = await validateEditProfileData(req);

  if (!isEditAllowed){
    res.status(400).send("You can not change your email.")
  }

  const user = req.user;
  res.send("User Updated successfully...")


  }
  catch(err){
    res.status(500).send("Server Error: " + err.message)
  }


})


module.exports = profileRouter;