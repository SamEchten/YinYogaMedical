const mongoose = require("mongoose");

const podcastSchema = mongoose.Schema({
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
    },
    thumbnailPath : {
        type : String,
        required: [true, "Thumbnail is verplicht"]
    },
    podcastPath : {
        type : String,
        required: [true, "Podcast is verplicht"]
    }
});

const Podcast = mongoose.model('podcast', podcastSchema);
module.exports = Podcast;