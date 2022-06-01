const { createMollieClient } = require("@mollie/api-client");
const config = require("../config").config;
const User = require("../models/User");

const mollieClient = createMollieClient({ apiKey: config.mollie.testKey });

module.exports.createPayment = async (amount, description, redirectUrl, webhookUrl, productId, userId) => {
    const payment = await mollieClient.payments.create({
        amount: {
            value: amount,
            currency: "EUR"
        },
        description: description,
        redirectUrl: redirectUrl,
        webhookUrl: webhookUrl,
        metadata: {
            productId,
            userId
        }
    });

    return payment;
}

module.exports.createSubscription = async (amount, description, webhookUrl, productId, userId, mandateId) => {
    if (await !isCustomer(userId)) {
        customerId = await this.createCustomer(userId);
    } else {
        const user = await User.findOne({ _id: userId });
        if (user) {
            customerId = user.customerId;
        }
    }

    console.log(customerId)

    const subscription = await mollieClient.customers_subscriptions.create({
        customerId: customerId,
        amount: {
            currency: "EUR",
            value: amount
        },
        description: description,
        interval: "1 month",
        webhookUrl: webhookUrl
    });

    return subscription;
}

module.exports.createMandate = async (customerName, customerAccount, userId) => {
    let customerId;
    if (! await isCustomer(userId)) {
        customerId = await this.createCustomer(userId);
    } else {
        User.findOne({ _id: userId }, async (err, user) => {
            if (user) {
                customerId = user.customerId;
            } else {
                throw Error({ message: "Geen gebruiker gevonden met dit id" });
            }
        })
    }

    const mandate = await mollieClient.customers_mandates.create({
        customerId: customerId,
        method: "directdebit",
        customerName: customerName,
        customerAccount: customerAccount, //IBAN
        signatureDate: new Date(),
        mandateReference: "Het_Eigen_Wijze_lichaam_" + userId + ""
    });

    await User.updateOne({ _id: userId }, { $set: { mandateId: mandate.id } });
}

module.exports.createCustomer = async (userId) => {
    User.findOne({ _id: userId }, async (err, user) => {
        if (user) {
            const customer = await mollieClient.customers.create({
                name: user.fullName,
                email: user.email
            });
            await User.updateOne({ _id: userId }, { $set: { customerId: customer.id } });
            return customer.id;
        } else {
            throw Error({ message: "Geen gebruiker gevonden met dit id" });
        }
    });
}

module.exports.getPaymentInfo = async (id) => {
    const paymentInfo = await mollieClient.payments.get(id);
    return paymentInfo;
}

const isCustomer = async (userId) => {
    let found = false;
    User.findOne({ _id: userId }, (err, user) => {
        if (user) {
            if (user.customerId) {
                found = true;
            }
        }
    });
    return found;
}