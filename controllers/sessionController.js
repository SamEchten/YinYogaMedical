const User = require("../models/User");

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
        res.status(400).send("error: user not created");
    }
}

module.exports.logout = (req, res) => {

}