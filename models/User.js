const mongoose = require("mongoose");
const {isEmail} = require("validator");

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, "U heeft geen e-mailadres ingevuld"],
        unique: [false, "Er bestaat al een account met dit e-mailadres"],
        lowercase: true,
        validate: [isEmail, "Het opgegeven e-mailadres is niet geldig"]
    },
    fullName: {
        type: String,
        required: [true, "U heeft geen naam ingevuld"],
        lowercase: false
    },
    password: {
        type: String,
        required: [true, "U heeft geen wachtwoord ingevuld"],
        minLength: 6
    },
    phoneNumber: {
        type: String,
        required: [true, "U heeft geen telefoonnummer ingevuld"],
        minlength: 10
    },
    notes: {
        type: String,
        maxLength: [256, "Uw notities mogen maximaal 256 karakters lang zijn"]
    },
    subscription: {
        type: Array
    },
    familyMembers: {
        type: Array
    },
    purchases: {
        type: Array
    }
});

const User = mongoose.model('user', userSchema);
module.exports = User;