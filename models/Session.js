const mongoose = require("mongoose");

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
        required: [true, "De lengte van de les in verplicht"]
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

const Session = mongoose.model('session', sessionSchema);
module.exports = Session;