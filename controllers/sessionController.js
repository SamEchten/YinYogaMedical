const Session = require("../models/Session");
const User = require("../models/User");
const path = require("path");
const { handleSessionErrors } = require("./errorHandler");
const userController = require("./userController");

//TODO: only show non private session
//      do show if req was made by admin or participants
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
    const { title, location, date, duration, participants, teacher,
        description, maxAmountOfParticipants, weekly, private } = req.body;

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
            weekly,
            private
        });
        res.status(201).json({ id: session.id });
    } catch (err) {
        let errors = handleSessionErrors(err);
        res.json(errors);
    }
}

module.exports.update = async (req, res) => {
    const { id } = req.params;
    const body = req.body;

    try {
        const session = Session.findOne({ id }, async());
        if (session) {
            await Session.updateOne({ id }, { $set: body });
            res.status(200).json({ id: session.id });
        } else {
            res.status(404).json({ error: "Geen sessie gevonden met dit Id" })
        }
    } catch (err) {
        res.status(400).json({ error: "Er is iets fout gegaan" });
    }
}

module.exports.delete = async (req, res) => {
    const { id } = req.params;

    try {
        const session = await Session.findOne({ id });
        if (session) {
            session.remove();
            //Send email to participants
            //Set back hours of participants
            res.sendStatus(200).json({ message: "Sessie is verwijderd" });
        } else {
            res.status(404).json({ error: "Geen sessie gevonden met dit Id" })
        }
    } catch (err) {
        res.status(400).json({ error: "Er is iets fout gegaan" });
    }
}

module.exports.signup = async (req, res) => {
    const sessionId = req.params.id;
    const userId = req.body.userId;

    if (sessionId) {
        try {
            Session.findOne({ _id: sessionId }, async (err, session) => {
                //Check if session with given id exists ->
                if (session) {
                    //Check if session is not full ->
                    const amountOfParticipants = session.participants.length;
                    const maxAmountOfParticipants = session.maxAmountOfParticipants;

                    if (amountOfParticipants < maxAmountOfParticipants) {
                        User.findOne({ _id: userId }, async (err, user) => {
                            //Check if user with given id exists ->
                            if (user) {
                                //Check if user is already signedup for this session ->
                                if (!session.participants.some(e => e.userId == userId)) {
                                    //Add user to participants / save document ->
                                    session.participants.push({ userId });
                                    session.save();
                                    res.status(200).json({ message: "U bent succesvol aangemeld" });
                                } else {
                                    res.status(400).json({ error: "U bent al aangemeld voor deze les" });
                                }
                            } else {
                                res.status(404).json({ error: "Geen gebruiker gevonden met dit id" });
                            }
                        });
                    } else {
                        res.status(400).json({ error: "Deze sessie is al vol" });
                    }
                } else {
                    res.status(404).json({ error: "Geen sessie gevonden met dit Id" });
                }
            });
        } catch (err) {
            res.status(400).json({ error: "Er is iets fout gegaan" });
        }
    } else {
        res.status(400).json({ error: "Er is geen sessionId opgestuurd" });
    }
}

module.exports.signout = async (req, res) => {

}

module.exports.view = (req, res) => {

}

module.exports.adminview = (req, res) => {

}