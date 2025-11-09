const validator = require("validator");

const ValidateSignupData = (req, res, next) => {
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

    next();
}

module.exports = {
  ValidateSignupData,
}