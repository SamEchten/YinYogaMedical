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
    description: {
        type: String,
        requierd: [true, "Beschrijving is verplicht"]
    },
    category: {
        type: String,
        required: [true, "Category is verplicht"],
        default: "Overig product"
    },
    amountOfHours: {
        type: Number,
        required: false,
        minimum: 0
    },
    toSchedule: {
        type: Boolean,
        required: [true, "U bent vergeten aan te geven of dit product apart moet worden ingepland"]
    },
    validFor: {
        type: Number,
        default: 1,
        minimum: 0
    },
    recurring: {
        type: Boolean,
        default: false
    }
});

const Product = mongoose.model('product', productSchema);
module.exports = Product;