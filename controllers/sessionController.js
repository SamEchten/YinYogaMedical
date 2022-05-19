const Session = require("../models/Session");
const User = require("../models/User");
const path = require("path");
const { handleSessionErrors } = require("./errorHandler");
const userController = require("./userController");

//TODO: only show non private session
//      do show if req was made by admin or participants
module.exports.get = async (req, res) => {
    const { id } = req.params;
    console.log(id);
    if (id) {
        //Get single session
        try {
            const session = await Session.findOne({ _id: id });
            console.log(session);
            if (session) {
                res.status(200).json(session);
            }
        } catch (err) {
            res.status(400).json({ error: "Geen sessie gevonden met dit Id" });
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

module.exports.getByUserId = async (req, res) => {
    const { id } = req.body;
    console.log(id);

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
            res.status(200).json({ message: "Sessie is verwijderd" });
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
    const comingWith = req.body.comingWith;

    if (sessionId) {
        try {
            const session = await Session.findOne({ id: sessionId });
            await session.addParticipants(sessionId, { userId, comingWith });
            res.status(200).json({ message: "U bent succesvol aangemeld" });
        } catch (err) {
            res.status(400).json({ message: err.message });
        }
    } else {
        res.status(400).json({ message: "Er is geen sessionId gegegeven" });
    }
}

module.exports.signout = async (req, res) => {

}

module.exports.view = (req, res) => {
    res.render(path.join(__dirname, "../views/agenda"));
}

module.exports.adminview = (req, res) => {

}