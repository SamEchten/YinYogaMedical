const User = require("../models/User");
const jwt = require("jsonwebtoken");
const path = require("path");
const secret = require("../config").config.secret;
const { handleUserErrors } = require("./errorHandler");
const { signUpMail } = require("../controllers/mailController");
const maxAge = 24 * 60 * 60;

//Login_post
//Endpoint to login a user
//Succes -> 200 OK + user info object
//Error -> 400 Bad Request + error object
module.exports.login_post = async (req, res) => {
    let { email, password } = req.body;
    try {
        let user = await User.login(email, password);

        //Send jwt token to client ->
        sendJwtCookie(res, user._id, user.fullName, user.email, user.isEmployee);

        //Send user info to client ->
        res.status(200).json({
            "id": user._id,
            "fullName": user.fullName
        });
    } catch (err) {
        let errors = handleUserErrors(err);
        res.status(400).json(errors);
    }
}

//Signup_post
//Endpoint for signing up users
//Succes -> 201 Created + user info object
//Error -> 400 Bad Request + error object
module.exports.signup_post = async (req, res) => {
    const { fullName, email, password, phoneNumber, notes } = req.body;
    try {
        //Insert user into database
        const user = await User.create({ fullName, email, password, phoneNumber, notes, isEmployee: true });

        //Send jwt cookie to client
        sendJwtCookie(res, user._id, user.fullName, user.email, user.isEmployee);

        //Send mail to user
        signUpMail({
            fullName: user.fullName,
            email: user.email
        });

        //Send user info back to client
        res.status(201).json({
            "id": user._id,
            "fullName": user.fullName
        });



    } catch (err) {
        let errors = handleUserErrors(err);
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
const sendJwtCookie = (res, id, fullName, email, isEmployee) => {
    let userId = id.toString();
    let token = createToken(userId, fullName, isEmployee);

    res.cookie("jwt", token, {
        expiresIn: maxAge * 1000,
        httpOnly: true
    });


    res.cookie("user", JSON.stringify({ userId, fullName, email, isEmployee }), {
        expiresIn: maxAge * 1000
    })
}

//createToken
//Params:   id
//          fullName
//          isEmployee
//Creates a jwt token using the given paramaters, expires in 1 day
const createToken = (id, fullName, isEmployee) => {
    return jwt.sign({ id, fullName, isEmployee }, secret, {
        expiresIn: maxAge
    });
}

module.exports.login_get = (req, res) => {
    res.render(path.join(__dirname, "../views/login"));
}

module.exports.signup_get = (req, res) => {
    res.render(path.join(__dirname, "../views/register"));
}

module.exports.logout = (req, res) => {
    res.clearCookie("jwt");
    res.clearCookie("user");
    res.redirect("/login");
}