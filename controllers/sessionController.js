const Session = require("../models/Session");
const User = require("../models/User");
const path = require("path");
const { handleSessionErrors } = require("./errorHandler");
const userController = require("./userController");

//TODO: only show non private session
//do show if req was made by admin or participants
module.exports.get = async (req, res) => {
    const { id } = req.params;
    let userId;
    if (req.cookies.user) {
        userId = JSON.parse(req.cookies.user).userId;
    }
    //Get single session
    if (id) {
        try {
            const session = await Session.findOne({ _id: id });
            if (session) {
                const sessionInfo = await getSingleSessionInfo(session, userId);
                res.status(200).json(sessionInfo);
            } else {
                res.status(404).json({ message: "Geen sessie gevonden met dit id" })
            }
        } catch (err) {
            res.status(404).json({ error: "Geen sessie gevonden met dit id" });
        }
    } else {
        try {
            const allSessions = await getAllSessions(userId);
            const sortedSessions = await sortSessions(allSessions, userId);
            res.status(200).json(sortedSessions);
        } catch (err) {
            res.status(400).json({ message: "Er is iets fout gegaan", error: err.message });
        }
    }
}

const getSingleSessionInfo = async (session, userId) => {
    if (session) {
        if (await isAdmin(userId)) {
            return session;
        } else {
            return {
                id: session._id,
                title: session.title,
                location: session.location,
                date: session.date,
                duration: session.duration,
                teacher: session.teacher,
                description: session.description,
                maxAmountOfParticipants: session.maxAmountOfParticipants,
                amountOfParticipants: await Session.getAmountOfParticipants(session._id)
            }
        }
    }
}

const isAdmin = async (userId) => {
    const user = await User.findOne({ _id: userId });
    if (user) {
        if (user.isEmployee) {
            return true;
        }
        return false;
    } else {
        return false;
    }
}

//Gets all sessions sorted by week and day
const getAllSessions = async () => {
    const firstDayOfWeek = getFirstDayOfWeek();

    const sessions = await Session.find({
        date: {
            $gte: firstDayOfWeek
        }
    }).sort({ date: 1 });

    return sessions;
}


const sortSessions = async (sessions, userId) => {
    const daysOfWeek = ["zondag", "maandag", "dinsdag", "woensdag", "donderdag", "vrijdag", "zaterdag"];
    let allSessions = {};
    let weekInfo = {
        zondag: [], maandag: [], dinsdag: [], woensdag: [],
        donderdag: [], vrijdag: [], zaterdag: []
    };

    for (index in sessions) {
        let session = await getSessionInfo(sessions[index], userId);
        if (session != null) {
            const dayNr = session.date.getDay();
            const weekNr = session.date.getWeekNumber();
            const day = daysOfWeek[dayNr];

            if (allSessions[weekNr] != null) {
                weekInfo = allSessions[weekNr];
            }
            weekInfo[day].push(session);
            allSessions[weekNr] = weekInfo;
            weekInfo = {
                zondag: [], maandag: [], dinsdag: [], woensdag: [],
                donderdag: [], vrijdag: [], zaterdag: []
            }
        }
    }

    return allSessions;
}

const getSessionInfo = async (session, userId) => {
    let sessionInfo = {
        id: session._id,
        title: session.title,
        location: session.location,
        date: session.date,
        duration: session.duration,
        amountOfParticipants: await Session.getAmountOfParticipants(session._id),
        maxAmountOfParticipants: session.maxAmountOfParticipants,
        teacher: session.teacher,
        description: session.description
    }

    if (userId != null) {
        if (session.private && !userParticipates(userId, session.participants)) {
            return null;
        }

        if (userParticipates(userId, session.participants)) {
            sessionInfo["participates"] = true;
        }
    }

    return sessionInfo;
}

const userParticipates = (userId, participants) => {
    if (participants.some(e => e.userId == userId)) {
        return true;
    }
    return false;
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
        const session = await Session.findOne({ _id: id });
        if (session) {
            session.remove();
            //Send email to participants
            //Set back hours of participants
            res.status(200).json({ message: "Sessie is verwijderd" });
        } else {
            res.status(404).json({ message: "Geen sessie gevonden met dit Id" })
        }
    } catch (err) {
        res.status(400).json({ message: "Er is iets fout gegaan" });
    }
}

module.exports.signup = async (req, res) => {
    const sessionId = req.params.id;
    const userId = req.body.userId;
    const comingWith = req.body.comingWith;

    if (sessionId) {
        try {
            const session = await Session.findOne({ _id: sessionId });
            if (session) {
                await session.addParticipants(sessionId, { userId, comingWith });
                res.status(200).json({ message: "U bent succesvol aangemeld" });
            } else {
                res.status(400).json({ message: "Er is geen sessie gevonden met dit id" });
            }
        } catch (err) {
            res.status(400).json({ message: err.message });
        }
    } else {
        res.status(400).json({ message: "Er is geen sessionId gegegeven" });
    }
}

module.exports.signout = async (req, res) => {
    const sessionId = req.params.id;
    const userId = req.body.userId;

    if (sessionId) {
        try {
            let session = await Session.findOne({ sessionId });

            if (session) {
                for (index in session.participants) {
                    let participant = session.participants[index];
                    if (participant.userId == userId) {
                        if (rek.cookies.userId == participant.userId || rek.cookies.isAdmin == true) {
                            session.participants.splice(index, 1);
                            session.save();
                            res.status(200).json({ message: "Succesvol uitgeschreven" });
                        }
                        else {
                            res.status(400).json({ message: "U bent niet gemachtigd deze persoon uit te schrijven" });
                        }
                    }
                }
            } else {
                res.status(400).json({ message: "Er is geen sessie gevonden met dit id" });
            }
        }
        catch (err) {
            res.status(400).json({ message: err.message });
        }
    }
    else {
        res.status(400).json({ message: "Er is geen sessionId gegegeven" });
    }

}

module.exports.view = (req, res) => {
    res.render(path.join(__dirname, "../views/agenda"), { isAdmin: false });
}

module.exports.adminview = (req, res) => {

}