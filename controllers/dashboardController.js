const path = require("path");
const Transactions = require("../models/Transactions");
const Session = require("../models/Session");

module.exports.viewDashboard = async (req, res) => {
    res.render(path.join(__dirname, "../views/dashboard/dashboard"));
}

module.exports.productStats = async (req, res) => {
    const transactions = await Transactions.find({});
    let amountOfBoughtProducts = 0;
    let amountOfBoughtSubscriptions = 0;

    for (i in transactions) {
        let transaction = transactions[i];
        amountOfBoughtProducts += transaction.transactions.length;
        amountOfBoughtSubscriptions += transaction.subscriptions.length;
    }

    res.status(200).json({ amountOfBoughtProducts, amountOfBoughtSubscriptions });
}

module.exports.sessionStats = async (req, res) => {
    const sessions = await Session.find({});
    res.status(200).json({ amountOfSessions: sessions.length });
}