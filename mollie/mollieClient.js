const { createMollieClient, PaymentStatus } = require("@mollie/api-client");
const Transactions = require("../models/Transactions");
const config = require("../config").config;
const User = require("../models/User");

const mollieClient = createMollieClient({ apiKey: config.mollie.testKey });

module.exports.createPayment = async (amount, description, redirectUrl, webhookUrl, productId, userId, customerId, sequenceType) => {
    const payment = await mollieClient.payments.create({
        amount: {
            value: amount,
            currency: "EUR"
        },
        description: description,
        redirectUrl: redirectUrl,
        webhookUrl: webhookUrl,
        sequenceType: sequenceType,
        customerId: customerId,
        metadata: {
            productId,
            userId,
            customerId
        }
    });

    return payment;
}

module.exports.getSubscription = async (subId) => {
    const subscription = await mollieClient.customers_subscriptions.get({ id: subId });
    return subscription;
}

module.exports.cancelSubscription = async (subId, customerId) => {
    const subscription = await mollieClient.customers_subscriptions.cancel(subId, { customerId: customerId });
    return subscription;
}

module.exports.createFirstPayment = async (product, user) => {
    const redirectUrl = config.webhookUrl + "/producten?succes=true&productId=" + product.id + "";
    const webHookUrl = config.webhookUrl + "/api/product/webhook/";
    const payment = await this.createPayment(
        product.price, product.productName, redirectUrl, webHookUrl, product.id, user.id, user.customerId, "first"
    );
    return payment;
}

module.exports.createSubscription = async (customerId, amount, description, webhookUrl) => {
    const startDate = getStartDate();
    console.log(startDate);
    const subscription = await mollieClient.customers_subscriptions.create({
        customerId: customerId,
        amount: {
            currency: 'EUR',
            value: amount,
        },
        interval: '1 month',
        startDate: startDate,
        description: description,
        webhookUrl: webhookUrl
    });
    return subscription;
}

const getStartDate = () => {
    const curDate = new Date();
    let startDate = new Date(curDate.setMonth(curDate.getMonth() + 1));

    let day = startDate.getDate();
    if (day < 10) {
        let dayString = day.toString();
        day = "0" + dayString
    }

    let month = startDate.getMonth();
    if (month < 10) {
        let monthString = month.toString();
        month = "0" + monthString
    }

    let year = startDate.getFullYear();

    return (year + "-" + month + "-" + day)
}

module.exports.hasMandate = async (customerId) => {
    const mandates = await mollieClient.customers_mandates.page({ customerId: customerId });
    if (mandates.length > 0) {
        for (let i = 0; i < mandates.length; i++) {
            const mandate = mandates[i];
            if (mandate.status == "valid" || mandate.status == "pending") {
                return true;
            }
        }
    } else {
        return false;
    }
    return false;
}

module.exports.isPaid = async (paymentId) => {
    const payment = await mollieClient.payments.get(paymentId);
    if (payment.status == PaymentStatus.paid) {
        return true;
    }
    return false;
}

module.exports.createCustomer = async (userId) => {
    const user = await User.findOne({ _id: userId });
    if (user) {
        const customer = await mollieClient.customers.create({
            name: user.fullName,
            email: user.email,
            metadata: {
                userId
            }
        });
        await User.updateOne({ _id: userId }, { $set: { customerId: customer.id } });
        return customer.id;
    } else {
        throw Error({ message: "Geen gebruiker gevonden met dit id" });
    }
}

module.exports.getPaymentInfo = async (id) => {
    const paymentInfo = await mollieClient.payments.get(id);
    return paymentInfo;
}