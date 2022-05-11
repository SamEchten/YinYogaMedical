const User = require("../models/User");
const jwt = require("jsonwebtoken");
const secret = "C!]TM#qU9=pD5`t5T$o]:/%Ai%vG:{";
const maxAge = 24 * 60 * 60;

//handleErrors
//Params:   err
//Handles the error passed through by the login and signup methods
//Returns an error object containing the error messages for the different fields
const handleErrors = (err) => {
    const errors = {fullName: null, email: null, password: null, phoneNumber: null, notes: null};

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

module.exports.signup_get = (req, res) => {
    res.send("signup page");
}

//Login_post
//Endpoint to login a user
//Succes -> 200 OK + user info object
//Error -> 400 Bad Request + error object
module.exports.login_post = async (req, res) => {
    let { email, password } = req.body;

    try {
        let user = await User.login(email, password);
        
        //Send jwt token to client ->
        sendJwtCookie(res, user._id, user.fullName, user.isEmployee);

        //Send user info to client ->
        res.status(200).json({
            "id": user._id,
            "fullName": user.fullName
        });
    } catch(err) {
        let errors = handleErrors(err);
        res.status(400).json(errors);
    } 
}

//Signup_post
//Endpoint for signing up users
//Succes -> 201 Created + user info object
//Error -> 400 Bad Request + error object
module.exports.signup_post = async (req, res) => {
    const {fullName, email, password, phoneNumber, notes} = req.body;
    try {
        //Insert user into database
        const user = await User.create({fullName, email, password, phoneNumber, notes, isEmployee: true});

        //Send jwt cookie to client
        sendJwtCookie(res, user._id, user.fullName, user.isEmployee);

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

//SendJwtCookie
//Params:   res
//          id
//          fullName
//          isEmployee
//Creates a token and sends it to the client via the response
//Cookie is valid for 1 day and is httpOnly
const sendJwtCookie = (res, id, fullName, isEmployee) => {
    let token = createToken(id, fullName, isEmployee);
    res.cookie("jwt", token, {
        expiresIn: maxAge * 1000,
        httpOnly: true
    });
}


//createToken
//Params:   id
//          fullName
//          isEmployee
//Creates a jwt token using the given paramaters, expires in 1 day
const createToken = (id, fullName, isEmployee) => {
    return jwt.sign({id, fullName, isEmployee}, secret, {
        expiresIn: maxAge
    });
}

module.exports.logout = (req, res) => {

}