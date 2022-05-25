const { createMollieClient } = require("@mollie/api-client");
const config = require("../config").config;

const mollieClient = createMollieClient({ apiKey: config.mollie.testKey });

module.exports.createPayment = async (amount, description, redirectUrl, webhookUrl, productId) => {
    const payment = await mollieClient.payments.create({
        amount: {
            value: amount,
            currency: "EUR"
        },
        description: description,
        redirectUrl: redirectUrl,
        webhookUrl: webhookUrl,
        metadata: {
            productId: productId
        }
    });

    return payment;
}