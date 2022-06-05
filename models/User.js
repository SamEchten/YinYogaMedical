const mongoose = require("mongoose");
const { isEmail } = require("validator");
const bcrypt = require("bcryptjs");

const subscriptionSchema = mongoose.Schema({
    id: String,
    expireDate: Date
});

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, "U heeft geen e-mailadres ingevuld"],
        unique: true,
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
    isEmployee: {
        type: Boolean,
        default: false
    },
    subscription: {
        type: String,
        default: null
    },
    familyMembers: {
        type: Array
    },
    classPassHours: {
        type: Number,
        default: 0
    },
    customerId: {
        type: String,
        default: null
    }
});

userSchema.pre("save", async function (next) {
    let salt = await bcrypt.genSaltSync(10);
    this.password = await bcrypt.hashSync(this.password, salt);
    next();
});

userSchema.statics.login = async function (email, password) {
    let user = await this.findOne({ email });
    //User with given email exists ->
    if (user) {
        let auth = await bcrypt.compareSync(password, user.password);
        if (auth) {
            return user;
        }
        throw Error(JSON.stringify({ message: "Incorrect wachtwoord of email" }));
    }
    //User with given email does not exist ->
    throw Error(JSON.stringify({ message: "Incorrect wachtwoord of email" }));
}

const User = mongoose.model('user', userSchema);
module.exports = User;