const mongoose = require("mongoose");

const transactionsSchema = mongoose.Schema({
    customerId: {
        type: String,
        required: true,
        unique: true
    },
    transactions: {
        type: Array,
        required: true,
    },
    subscriptions: {
        type: Array,
        required: true
    }
});

const Transactions = mongoose.model('transactions', transactionsSchema);
module.exports = Transactions;