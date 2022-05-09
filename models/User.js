const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    userName: {
        type: String,
        required: true,
        unique: false,
        lowercase: false
    },
    password: {
        type: String,
        required: true,
        minLength: 6
    }
});

const User = mongoose.model('user', userSchema);