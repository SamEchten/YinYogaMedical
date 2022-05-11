const User = require("../models/User");
const {handleErrors} = require("./errorHandler");

module.exports.get = async (req, res) => {
    const {id} = req.params;

    //Get single user by given Id ->
    if(id) {
        try {
            let user = await User.findOne({id});
            res.status(200).json(user);
        } catch(err) {
            res.status(400).json(err);
        }
    }

    //Get all users ->
    try {
        let users = await User.find();
        res.status(200).json(users);
    } catch(err) {
        res.status(400).json(err);
    }
}

module.exports.add = async (req, res) => {
    const {fullName, email, phoneNumber, password, notes, isEmployee} = req.body;
    try {
        const user = await User.create({fullName, email, password, phoneNumber, notes, isEmployee});
        res.status(201).json({
            id: user._id,
            fullName: user.fullName
        });
    } catch(err) {
        let errors = handleErrors(err);
        res.status(400).json(errors);
    }
}

module.exports.update = async (req, res) => {
    const id = req.params.id;
    const {fullName, phoneNumber, notes, isEmployee} = req.body;

    if(id) {
        try {
            if(await User.findOne({id})) {
                //TODO:
                //update user
            } else {
                res.status(404).send();
            }
        } catch(err) {
            res.status(400).send();
        }
    } else {
        //Id was not provided
        res.status(400).send();
    }
}

module.exports.delete = async (req, res) => {
    const id = req.params.id;
    if(id) {
        try {
            //Check if user exists ->
            if(await User.findOne({id})) {
                //Delete user ->
                await User.deleteOne({id});
                res.status(200).send();
            } else {
                //User does not exit ->
                res.status(404).send();
            }
        } catch(err) {
            res.status(400).send();
        }
    } else {
        //Id was not provided ->
        res.status(400).send();
    }
}