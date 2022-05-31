const Session = require("../models/Session");
const User = require("../models/User");
const path = require("path");
const { handleSessionErrors } = require("./errorHandler");
const { update } = require("./userController");
const { Console } = require("console");

//TODO: only show non private session
//do show if req was made by admin or participants
module.exports.get = async (req, res) => {
    const { id } = req.params;
    let userId;
    if (req.cookies.user) {
        userId = JSON.parse(req.cookies.user).userId;
    }

    if (id) {
        //Get single session
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
        //Get all sessions
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
        if (session.private) {
            if (await isAdmin(userId)) {
                sessionInfo["participants"] = session.participants;
                return sessionInfo;
            }

            if (userParticipates(userId, session.participants)) {
                sessionInfo["participates"] = true;
                return sessionInfo;
            } else {
                return null;
            }
        }

        if (userParticipates(userId, session.participants)) {
            sessionInfo["participates"] = true;
            return sessionInfo;
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
    const diff = date.getDate() - day + (day === 0 ? -6 : 1)
    let result = new Date(date.setDate(diff));
    result = result.toISOString().split("T")[0] + "T00:00:00.000Z";
    return result;
}

module.exports.add = async (req, res) => {
    try {
        const { title, location, date, duration, participants, teacher,
            description, maxAmountOfParticipants, weekly, private } = req.body;

        if (duration > 0) {
            if (maxAmountOfParticipants > 0) {
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
            } else {
                res.status(400).json({ message: "Maximaal aantal deelnemers moet meer zijn dan 0" });
            }
            res.status(201).json({ id: session.id });
        } else {
            res.status(400).json({ message: "Ongeldige duur" })
        }
    } catch (err) {
        let errors = handleSessionErrors(err);
        res.status(400).json(errors);
    }
}

module.exports.update = async (req, res) => {
    const { id } = req.params;
    const body = req.body;

    try {
        const session = await Session.findOne({ _id: id });
        if (session) {
            if (body.duration > 0) {
                if (body.maxAmountOfParticipants > 0) {
                    await Session.updateOne({ _id: id }, { $set: body });
                    res.status(200).json({ id: session._id });
                } else {
                    res.status(400).json({ message: "Maximaal aantal deelnemers moet meer zijn dan 0" });
                }
            } else {
                res.status(400).json({ message: "Ongeldige duur" });
            }
        } else {
            res.status(404).json({ error: "Geen sessie gevonden met dit Id" })
        }
    } catch (err) {
        console.log(err);
        res.status(400).json({ message: "Er is iets fout gegaan", error: err });
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
        res.status(400).json({ message: "Er is iets fout gegaan", error: err });
    }
}

module.exports.signup = async (req, res) => {
    const sessionId = req.params.id;
    const userId = req.body.userId;

    const comingWith = req.body.comingWith;
    const comingWithAmount = comingWith ? comingWith.length : null;
    const reqId = JSON.parse(req.cookies.user).userId;
    const admin = await isAdmin(reqId);

    if (userId == reqId || admin) {
        if (sessionId) {
            try {
                const session = await Session.findOne({ _id: sessionId });
                if (session) {
                    User.findOne({ _id: userId }, async (err, user) => {
                        if (user) {
                            const sessionDate = new Date(session.date.toISOString().slice(0, -1));
                            if (sessionDate > new Date()) {
                                if (checkUserBalance(user, session, comingWithAmount)) {
                                    try {
                                        await session.addParticipants(sessionId, { userId, comingWith });
                                        await updateUserHours(user, session, comingWithAmount);
                                        res.status(200).json({ message: "U bent succesvol aangemeld" });
                                    } catch (err) {
                                        res.status(400).json({ message: err.message });
                                    }
                                } else {
                                    if (admin) {
                                        res.status(400).json({ message: "Gebruiker heeft niet genoeg saldo" });
                                    } else {
                                        res.status(400).json({ message: "U heeft niet genoeg saldo" });
                                    }
                                }
                            } else {
                                res.status(400).json({ message: "Deze sessie is al geweest" });
                            }
                        } else {
                            res.status(400).json({ message: "Er is geen gebruiker gevonden met dit id" });
                        }
                    });
                } else {
                    res.status(400).json({ message: "Er is geen sessie gevonden met dit id" });
                }
            } catch (err) {
                res.status(400).json({ message: err.message });
            }
        } else {
            res.status(400).json({ message: "Er is geen sessionId gegegeven" });
        }
    } else {
        res.status(400).json({ message: "U bent niet gemachtigd om deze persoon aan te melden" })
    }
}

const updateUserHours = async (user, session, comingWithAmount) => {
    let classPassHours = user.classPassHours;
    let sessionDuration = session.duration;
    sessionDuration /= 60;
    const sessionCost = sessionDuration + (sessionDuration * comingWithAmount);

    const newSaldo = classPassHours -= sessionCost;
    await User.updateOne({ _id: user.id }, { $set: { classPassHours: newSaldo } });
}

const checkUserBalance = (user, session, comingWithAmount) => {
    const classPassHours = user.classPassHours;
    let sessionDuration = session.duration;
    sessionDuration /= 60;
    const sessionCost = sessionDuration + (sessionDuration * comingWithAmount);

    if (classPassHours >= sessionCost) {
        return true
    }

    return false;
}

const deleteUser = (e, session, userId) => {
    if (e.userId == userId) {
        const index = session.participants.indexOf(e);
        session.participants.splice(index, 1)
        session.save();
    }
}

const returnSaldo = async (user, participants) => {
    let cost;
    for (i in participants) {
        const row = participants[i];
        if (row.userId == user.id) {
            cost = row.cost;
        }
    }
    const newSaldo = user.classPassHours + cost;
    console.log(newSaldo);
    await User.updateOne({ _id: user.id }, { $set: { classPassHours: newSaldo } })
}

module.exports.signout = async (req, res) => {
    const sessionId = req.params.id;
    const userId = req.body.userId;
    const cookieUserId = JSON.parse(req.cookies.user).userId;
    const cookieEmployee = JSON.parse(req.cookies.user).isEmployee;

    if (userId) {
        User.findOne({ _id: userId }, async (err, user) => {
            if (user) {
                if (sessionId) {
                    try {
                        let session = await Session.findOne({ _id: sessionId });
                        if (session) {
                            if (userParticipates(userId, session.participants)) {
                                if (cookieUserId == userId || cookieEmployee == true) {
                                    await returnSaldo(user, session.participants);
                                    session.participants.some(e => deleteUser(e, session, userId));
                                    res.status(200).json({ message: "Succesvol uitgeschreven" });
                                }
                                else {
                                    res.status(400).json({ message: "U bent niet gemachtigd deze gebruiker uit te schrijven" });
                                }
                            } else {
                                res.status(400).json({ message: "Deze gebruiker is momenteel niet ingeschreven voor deze les" });
                            }
                        } else {
                            res.status(400).json({ message: "Er is geen sessie gevonden met dit id" });
                        }
                    }
                    catch (err) {
                        console.log(err);
                        res.status(400).json({ message: err.message });
                    }
                }
                else {
                    res.status(400).json({ message: "Er is geen sessionId gegegeven" });
                }
            } else {
                res.status(400).json({ message: "Er is geen gebruiker gevonden met dit id" });
            }
        });
    } else {
        res.status(400).json({ message: "Er is geen userOd gegeven" });
    }
}

module.exports.view = (req, res) => {
    res.render(path.join(__dirname, "../views/agenda"), { isAdmin: false });
}
