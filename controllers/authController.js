const User = require("../models/User");
const jwt = require("jsonwebtoken");
const path = require("path");
const secret = require("../config").config.secret;
const { handleUserErrors } = require("./errorHandler");
const { signUpMail } = require("../controllers/mailController");
const mollieClient = require("../mollie/mollieClient");
const Transactions = require("../models/Transactions");
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
        sendCookies(res, user._id, user.fullName, user.email, user.isEmployee, user.classPassHours, user.subscriptions);

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
        const user = await User.create({ fullName, email, password, phoneNumber, notes, isEmployee: false });
        await createTransactions(user.id);

        //Send jwt cookie to client
        sendCookies(res, user._id, user.fullName, user.email, user.isEmployee, user.classPassHours, user.subscriptions);

        //Send mail to user
        // signUpMail({
        //     fullName: user.fullName,
        //     email: user.email
        // });

        //Send user info back to client
        res.status(201).json({
            "id": user._id,
            "fullName": user.fullName
        });



    } catch (err) {
        console.log(err);
        let errors = handleUserErrors(err);
        res.status(400).json(errors);
    }
}

const createTransactions = async (userId) => {
    const customerId = await mollieClient.createCustomer(userId);
    await Transactions.create({
        customerId: customerId,
        transactions: [],
        subscriptions: []
    });
}


//SendJwtCookie
//Params:   res
//          id
//          fullName
//          isEmployee
//Creates a token and sends it to the client via the response
//Cookie is valid for 1 day and is httpOnly
const sendCookies = (res, id, fullName, email, isEmployee, saldo, subscriptions) => {
    let userId = id.toString();
    let token = createToken(userId, fullName, isEmployee);

    res.cookie("jwt", token, {
        expiresIn: maxAge * 1000,
        httpOnly: true
    });

    res.cookie("user", JSON.stringify({ id: userId, fullName, email, isEmployee, saldo, subscriptions }), {
        expiresIn: maxAge * 1000
    });
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