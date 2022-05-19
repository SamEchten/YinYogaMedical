const Session = require("../models/Session");
const User = require("../models/User");
const path = require("path");
const { handleSessionErrors } = require("./errorHandler");
const userController = require("./userController");
const { startOfWeek, endOfWeek, getWeek } = require("date-fns");

//TODO: only show non private session
//      do show if req was made by admin or participants
module.exports.get = async (req, res) => {
    const { id } = req.params;
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
            const allSession = await getAllSessions();
            res.status(200).json(allSession);
        } catch (err) {
            res.status(400).json({ error: "Er is iets fout gegaan" });
        }
    }
}

//Gets all sessions sorted by week and day
const getAllSessions = async () => {
    const daysOfWeek = ["zondag", "maandag", "dinsdag", "woendag", "donderdag", "vrijdag", "zaterdag"];
    const firstDayOfWeek = getFirstDayOfWeek();
    const allSessions = {};

    const sessions = await Session.find({
        date: {
            $gte: firstDayOfWeek
        }
    }).sort({ datefield: 1 });

    let weekInfo = {
        zondag: [],
        maandag: [],
        dinsdag: [],
        woendag: [],
        donderdag: [],
        vrijdag: [],
        zaterdag: []
    };

    for (index in sessions) {
        const session = sessions[index];
        const dayNr = session.date.getDay();
        const weekNr = session.date.getWeekNumber();
        const day = daysOfWeek[dayNr];

        if (allSessions[weekNr] != null) {
            weekInfo = allSessions[weekNr];
        }
        weekInfo[day].push(session);
        allSessions[weekNr] = weekInfo;
    }
    return allSessions;
}

Date.prototype.getWeekNumber = function () {
    var d = new Date(Date.UTC(this.getFullYear(), this.getMonth(), this.getDate()));
    var dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    var yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return Math.ceil((((d - yearStart) / 86400000) + 1) / 7)
};

const getFirstDayOfWeek = () => {
    const date = new Date();
    const day = date.getDay();
    const diff = date.getDate() - day + (day === 0 ? -6 : 1);

    let result = new Date(date.setDate(diff));
    result = result.toISOString().split("T")[0] + "T00:00:00.000Z";
    return result;
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