const mongoose = require("mongoose");
const User = require("./User");

const sessionSchema = mongoose.Schema({
    title: {
        type: String,
        required: [true, "Titel is verplicht"]
    },
    location: {
        type: String,
        required: [true, "Locatie is verplicht"]
    },
    date: {
        type: Date,
        required: [true, "Datum is verplicht"]
    },
    duration: {
        type: Number,
        required: [true, "De lengte van de les in verplicht"],
        minimum: [0, "Ongeldige duur"]
    },
    participants: {
        type: Array
    },
    teacher: {
        type: String,
        required: [true, "De leraar van de les is verplicht"]
    },
    description: {
        type: String
    },
    maxAmountOfParticipants: {
        type: Number,
        required: [true, "Aantal deelnemers van de les in verplicht"]
    },
    weekly: {
        type: Boolean,
        required: [true, "Wekelijks is verplicht"]
    },
    private: {
        type: Boolean,
        default: false
    }
});

sessionSchema.statics.getAmountOfParticipants = async function (id) {
    const session = await Session.findOne({ _id: id });
    const participants = session.participants;
    let amountOfParticipants = 0;

    for (userIndex in participants) {
        const user = participants[userIndex];
        if (user.comingWith != null) {
            amountOfParticipants += user.comingWith.length + 1;
        } else {
            amountOfParticipants += 1;
        }
    }

    return amountOfParticipants;
}

sessionSchema.methods.addParticipants = async function (id, info) {
    const { userId, comingWith } = info;
    const session = this;
    const comingWithLength = comingWith ? comingWith.length : 0;
    const sessionDuration = session.duration / 60;
    const cost = (sessionDuration) + (comingWithLength * sessionDuration);

    if (session) {
        let comingWithLength = 0;
        if (comingWith != null) {
            comingWithLength = comingWith.length;
        }

        const sessionAmount = await Session.getAmountOfParticipants(id);
        const amountOfParticipants = 1 + comingWithLength;
        const maxAmountOfParticipants = session.maxAmountOfParticipants;

        if (sessionAmount != maxAmountOfParticipants) {
            if (sessionAmount + amountOfParticipants <= maxAmountOfParticipants) {
                const user = await User.findOne({ id: userId });
                if (user) {
                    //Check if user is already signedup for this session ->
                    if (!session.participants.some(e => e.userId == userId)) {
                        //Add user to participants / save document ->
                        session.participants.push({ userId, comingWith, cost });
                        await session.save();
                    } else {
                        throw Error("U bent al aangemeld voor deze les");
                    }
                } else {
                    throw Error("Geen gebruiker gevonden met dit id");
                }
            } else {
                const spacesLeft = maxAmountOfParticipants - sessionAmount;
                const errorString = spacesLeft == 1 ?
                    "Er is helaas nog maar 1 plek vrij" :
                    "Er zijn helaas nog maar " + spacesLeft + " plekken vrij";
                throw Error(errorString);
            }
        } else {
            throw Error("Deze sessie is helaas al vol");
        }
    }
};

const Session = mongoose.model('session', sessionSchema);
module.exports = Session;