const validator = require("validator");
const User = require("../models/user");


const ValidateSignupData = async(req, res, next) => {
    const {name, dateOfBirth, email, password} = req.body;

    if(!name || !dateOfBirth || !email || !password){
        return res.status(400).send("All fields are required.")
    }
    
    if (!validator.isEmail(email)){
        return res.status(400).send("Please enter a valid Email")
    }

    if (!validator.isStrongPassword(password)){
        return res.status(400).send("Please choose a strong password.")
    }

    const user = await User.findOne({email: email});

    if (user){
        return res.status(400).send(`"${email}" already exist.`)
    }


    next();
}

module.exports = {
  ValidateSignupData,
}