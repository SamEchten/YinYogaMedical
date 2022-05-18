const User = require("../models/User");
const { handleUserErrors } = require("./errorHandler");
const bcrypt = require("bcryptjs");
const path = require("path");

module.exports.get = async (req, res) => {
    const { id } = req.params;

    //Get single user by given Id ->
    if (id) {
        try {
            let user = await User.findOne({ id });
            res.status(200).json(user);
        } catch (err) {
            res.sendStatus(400);
        }
    } else {
        //Get all users ->
        try {
            let users = await User.find();
            res.status(200).json(users);
        } catch (err) {
            res.sendStatus(400);
        }
    }
}

module.exports.add = async (req, res) => {
    const { fullName, email, phoneNumber, password, notes, isEmployee } = req.body;
    try {
        const user = await User.create({ fullName, email, password, phoneNumber, notes, isEmployee });
        res.status(201).json({
            id: user._id,
            fullName: user.fullName
        });
    } catch (err) {
        let errors = handleUserErrors(err);
        res.status(400).json(errors);
    }
}

module.exports.update = async (req, res) => {
    const id = req.params.id;
    const body = req.body;

    if (id) {
        try {
            //Check if user with given id exists in db ->
            User.findOne({ id }, async (err, user) => {
                if (user) {
                    //Check if update request has isEmployee -> check if request was made by an admin
                    if (body.hasOwnProperty("isEmployee")) {
                        if (user.isEmployee) {
                            //Update user ->
                            await User.updateOne({ id }, { $set: body });
                            res.status(200).json({ id: user.id });
                        } else {
                            //Request was not made by admin ->
                            res.sendStatus(400);
                        }
                    }

                    //Request body containes password -> hash password
                    if (body.hasOwnProperty("password")) {
                        let salt = await bcrypt.genSaltSync(10);
                        body.password = await bcrypt.hashSync(body.password, salt);
                    }

                    //Update user ->
                    await User.updateOne({ id }, { $set: body });

                    //Find updated user doc and send to client ->
                    User.findOne({ id }, (err, doc) => {
                        if (err) {
                            res.sendStatus(400);
                        } else {
                            res.status(200).json({
                                id: doc._id,
                                fullName: doc.fullName
                            });
                        }
                    });
                } else {
                    req.sendStatus(404);
                }
                if (err) {
                    res.sendStatus(400);
                }
            });
        } catch (err) {
            res.sendStatus(400);
        }
    } else {
        //Id was not provided
        res.sendStatus(400);
    }
}

module.exports.delete = async (req, res) => {
    const id = req.params.id;
    if (id) {
        try {
            let user = await User.findOne({ id });
            //Check if user exists ->
            if (user) {
                //Delete user ->
                await user.remove();
                res.status(200).send();
            } else {
                //User does not exit ->
                res.status(404).send();
            }
        } catch (err) {
            res.sendStatus(400);
        }
    } else {
        //Id was not provided ->
        res.sendStatus(400);
    }
}

module.exports.viewEnrollments = (req, res) => {
    res.render(path.join(__dirname, "../views/profile/enrollments"));
}