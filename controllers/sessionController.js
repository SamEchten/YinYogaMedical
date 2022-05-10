const User = require("../models/User");

const handleErrors = (err) => {
    const errors = {email: null, password: null, phoneNumber: null, notes: null};

    //Duplicate email ->
    if(err.code == 11000) {
        errors.email = "Er bestaat al een account met dit e-mailadres";
    }

    //Password / phonenumber errors ->
    if(err.message.includes("user validation failed")) {
        Object.values(err.errors).forEach((error) => {
            let properties = error.properties;
            errors[properties.path] = properties.message;
        })
    }

    return errors;
}

module.exports.login_get = (req, res) => {
    res.render();
}

module.exports.login_post = async (req, res) => {
    const { email, password } = req.body;
    
}

module.exports.signup_get = (req, res) => {
    req.render();
}

module.exports.signup_post = async (req, res) => {
    const {fullName, email, password, phoneNumber, notes} = req.body;
    try {
        //Insert user into database
        const user = await User.create({fullName, email, password, phoneNumber, notes});

        //Send user info back to client
        res.status(201).json({
            "id": user._id, 
            "fullName": user.fullName});
    } catch(err) {
        let errors = handleErrors(err);
        res.status(400).json(errors);
    }
}

module.exports.logout = (req, res) => {

}