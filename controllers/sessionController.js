const User = require("../models/User");
const jwt = require("jsonwebtoken");
const secret = "C!]TM#qU9=pD5`t5T$o]:/%Ai%vG:{";
const maxAge = 24 * 60 * 60;

const handleErrors = (err) => {
    const errors = {email: null, password: null, phoneNumber: null, notes: null};

    //Duplicate email ->
    if(err.code == 11000) {
        errors.email = "Er bestaat al een account met dit e-mailadres";
        return errors;
    }

    //Password / phonenumber errors ->
    if(err.message.includes("user validation failed")) {
        Object.values(err.errors).forEach((error) => {
            let properties = error.properties;
            errors[properties.path] = properties.message;
        })

        return errors;
    }

    //Login errors ->
    let error = JSON.parse(err.message);
    errors[error.path] = error.message;
    return errors;
}

module.exports.login_get = (req, res) => {
    res.send("login page");
}

module.exports.login_post = async (req, res) => {
    let { email, password } = req.body;

    try {
        let user = await User.login(email, password);
        res.status(200).json({
            "id": user._id,
            "fullName": user.fullName
        });
    } catch(err) {
        let errors = handleErrors(err);
        res.status(400).json(errors);
    } 
}

module.exports.signup_get = (req, res) => {
    res.send("signup page");
}

module.exports.signup_post = async (req, res) => {
    const {fullName, email, password, phoneNumber, notes} = req.body;
    try {
        //Insert user into database
        const user = await User.create({fullName, email, password, phoneNumber, notes, isEmployee: true});
        const token = createToken(user._id, user.fullName, user.isEmployee);

        //Send jwt cookie to client
        res.cookie("jwt", token, {
            expiresIn: maxAge * 1000,
            httpOnly: true
        });

        //Send user info back to client
        res.status(201).json({
            "id": user._id, 
            "fullName": user.fullName
        });
    } catch(err) {
        let errors = handleErrors(err);
        res.status(400).json(errors);
    }
}

const createToken = (id, fullName, isEmployee) => {
    return jwt.sign({id, fullName, isEmployee}, secret, {
        expiresIn: maxAge
    });
}

module.exports.logout = (req, res) => {

}