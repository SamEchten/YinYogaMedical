const Session = require("../models/Session");
const path = require("path");
const { handleSessionErrors } = require("./errorHandler");

module.exports.get = async (req, res) => {
    const { id } = req.params;
    if (id) {
        //Get single session
        try {
            const session = await Session.findOne({ id });
            if (session) {
                res.status(200).json(session);
            } else {
                res.status(404).json({ error: "Geen sessie gevonden met dit Id" })
            }
        } catch (err) {
            res.status(400).json({ error: "Er iets fout gegaan" });
        }
    } else {
        //Get all sessions
        try {
            const sessions = await Session.find();
            res.status(200).json(sessions);
        } catch (err) {
            res.status(400).json({ error: "Er is iets fout gegaan" })
        }
    }
}

module.exports.add = async (req, res) => {
    const { title, location, date, duration, participants, teacher, description, maxAmountOfParticipants, weekly } = req.body;

    try {
        const session = await Session.create({
            title,
            location,
            date,
            duration,
            participants,
            teacher,
            description,
            maxAmountOfParticipants,
            weekly
        });
        res.status(201).json(session._id);
    } catch (err) {
        let errors = handleSessionErrors(err);
        res.json(errors);
    }
}

module.exports.update = async (req, res) => {
    const { id } = req.params;

    try {
        const session = Session.findOne({ id });
        if (session) {

        } else {
            res.status(404).json({ error: "Geen sessie gevonden met dit Id" })
        }
    } catch (err) {
        res.status(400).json({ error: "Er is iets fout gegaan" });
    }
}

module.exports.delete = async (req, res) => {
    const { id } = req.params.id;

    try {
        const session = await Session.findOne({ id });
        if (session) {
            session.remove();
            res.sendStatus(200);
        } else {
            res.status(404).json({ error: "Geen sessie gevonden met dit Id" })
        }
    } catch (err) {
        res.status(400).json({ error: "Er is iets fout gegaan" });
    }
}

module.exports.signup = async (req, res) => {

}

module.exports.cancel = async (req, res) => {

}

module.exports.view = (req, res) => {

}

module.exports.adminview = (req, res) => {

}