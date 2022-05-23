const mongoose = require("mongoose");

const productSchema = mongoose.Schema({
    productName: {
        type: String,
        required: [true, "Product naam is verplicht"]
    },
    price: {
        type: Number,
        required: [true, "Prijs is verplicht"]
    },
    discription: {
        type: String
    },
    amountOfHours: {
        type: Number,
        required: [true, "Het aantal uren is verplicht"]
    },
    toSchedule: {
        type: Boolean,
        required: [true, "U bent vergeten aan te geven of dit product apart moet worden ingepland"]
    }
});

const Product = mongoose.model('product', productSchema);
module.exports = Product;