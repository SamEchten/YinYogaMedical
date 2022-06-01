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
    category: {
        type: String,
        required: [true, "Category is verplicht"],
        default: "Overig product"
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
    },
    recurring: {
        type: Boolean,
        default: false
    }
});

const Product = mongoose.model('product', productSchema);
module.exports = Product;