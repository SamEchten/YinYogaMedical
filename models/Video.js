const mongoose = require("mongoose");

const videoSchema = mongoose.Schema({
    title: {
        type: String,
        required: [true, "Titel is verplicht"]
    },
    price: {
        type: String,
        required: [true, "Een prijs is verplicht"]
    },
    description: {
        type: String,
        required: [true, "Beschrijving is verplicht"]
    }
});

const Video = mongoose.model('video', videoSchema);
module.exports = Video;