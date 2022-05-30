const mongoose = require("mongoose");

const productSchema = mongoose.Schema({
    productName: {
        type: String,
        required: [true, "Product naam is verplicht"]
    },
    price: {
        type: String,
        required: [true, "Prijs is verplicht"]
    },
    discription: {
        type: String
    },
    amountOfHours: {
        type: Number,
        required: false
    },
    toSchedule: {
        type: Boolean,
        required: [true, "U bent vergeten aan te geven of dit product apart moet worden ingepland"]
    },
    validFor: {
        type: Number,
        required: [true, "De geldigheid van het product is verplicht"]
    }
});

const Product = mongoose.model('product', productSchema);
module.exports = Product;