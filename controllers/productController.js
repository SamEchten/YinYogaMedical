const Product = require("../models/Product");
const { handleUserErrors } = require("./errorHandler");
const mollieClient = require("../mollie/mollieClient");
const config = require("../config").config;
const path = require("path");
const User = require("../models/User");
const Transactions = require("../models/Transactions");
const mailController = require("../controllers/mailController");

module.exports.get = async (req, res) => {
    const id = req.params.id;

    if (id) {
        //Get single product
        getSingleProduct(res, id);
    } else {
        //Get all products
        getAllProducts(res);
    }

}

const getSingleProduct = async (res, id) => {
    try {
        Product.findOne({ _id: id }, async (err, product) => {
            if (product) {
                res.status(200).json(product);
            } else {
                res.status(400).json({ message: "Er is iets fout gegaan", error: err });
            }
        });
    } catch (err) {
        res.status(400).json({ message: "Er is iets fout gegaan", error: err });
    }
}

const getAllProducts = async (res) => {
    try {
        Product.find({}, async (err, products) => {
            if (products) {
                res.status(200).json(sortProducts(products));
            } else {
                res.status(400).json({ message: "Er is iets fout gegaan", error: err });
            }
        });
    } catch (err) {
        res.status(400).json({ message: "Er is iets fout gegaan", error: err });
    }
}

const sortProducts = (products) => {
    let sortedProducts = setSortedProducts(products);

    //Sort products
    for (i in products) {
        const product = products[i];
        for (j in sortedProducts) {
            const row = sortedProducts[j];
            if (product.category == row.category) {
                row.products.push(product);
            }
        }
    }

    return sortedProducts;
}

const getAllCategories = (products) => {
    let categories = [];

    //Get all categories
    for (i in products) {
        const category = products[i].category;
        if (!categories.includes(category)) {
            categories.push(category);
        }
    }

    return categories;
}

const setSortedProducts = (products) => {
    let allProducts = [];
    const categories = getAllCategories(products);

    for (i in categories) {
        const category = categories[i];
        allProducts.push({
            category: category,
            products: []
        });
    }

    return allProducts;
}

module.exports.add = async (req, res) => {
    req.body.price = convertPrice(req.body.price);
    try {
        const product = await Product.create(req.body);
        res.status(200).json({ id: product.id });
    } catch (err) {
        const error = handleUserErrors(err);
        res.status(400).json(error);
    }
}

const convertPrice = (price) => {
    const length = price.length;
    price = price.toString();
    if (length != 5) {
        if (!price.includes(".")) {
            price += ".00";
        } else {
            const num = price.split(".")[0];
            const decimals = price.split(".")[1];
            if (decimals.length != 2) {
                price = num + "." + "" + decimals[0] + "" + decimals[1];
            }
        }
    }

    return price;
}

module.exports.update = async (req, res) => {
    const id = req.params.id;
    const body = req.body;
    try {
        Product.findOne({ _id: id }, async (err, product) => {
            if (product) {
                body.price = convertPrice(body.price);
                await Product.updateOne({ _id: id }, { $set: body });
                res.status(200).json({ productId: product.id });
            } else {
                res.status(404).json({ message: "Er is geen product gevonden met dit id" });
            }
        });
    } catch (err) {
        res.status(400).json({ message: "Er is iets fout gegaan", error: err });
    }
}

module.exports.delete = async (req, res) => {
    const id = req.params.id;
    try {
        Product.findOne({ _id: id }, (err, product) => {
            if (product) {
                product.delete();
                res.status(200).json({ message: "Product is succesvol verwijderd" })
            } else {
                res.status(404).json({ message: "Er is geen product gevonden met dit id" });
            }
        });
    } catch (err) {
        res.status(400).json({ message: "Er is iets fout gegaan", error: err });
    }
}

module.exports.purchase = async (req, res) => {
    const id = req.params.id;
    const userId = req.body.userId;

    if (id && userId) {
        Product.findOne({ _id: id }, async (err, product) => {
            if (product) {
                User.findOne({ _id: userId }, async (err, user) => {
                    if (user) {
                        const purchaseInfo = await purchaseProduct(product, user);
                        if (purchaseInfo.message) {
                            res.status(400)
                        } else {
                            res.status(200);
                        }
                        res.json({ purchaseInfo });
                    } else {
                        res.status(404).json({ message: "Er is geen gebruiker gevonden met id id" })
                    }
                });
            } else {
                res.status(404).json({ message: "Er is geen product gevonden met dit Id" });
            }
        });
    } else {
        res.status(400).json({ message: "Er mist een userId of productId" });
    }
}

module.exports.cancel = async (req, res) => {
    const subId = req.params.id;
    const userId = req.body.userId;

    User.findOne({ _id: userId }, async (err, user) => {
        if (user) {
            const subscription = await cancelSubscription(user, subId);
            const customerId = user.customerId;
            const transactions = await Transactions.findOne({ customerId });

            //Remove subscription from user model
            let userSubscriptions = user.subscriptions;
            for (i in userSubscriptions) {
                let subscription = user.subscriptions[i];
                if (subscription.subscriptionId == subId) {
                    user.subscriptions.splice(i, 1);
                }
            }

            await User.updateOne({ _id: userId }, { $set: { subscriptions: userSubscriptions } });

            //Set status of subscription to canceled in transactions model
            for (i in transactions.subscriptions) {
                let subscription = transactions.subscriptions[i];
                if (subscription.subscriptionId == subId) {
                    subscription.status = "canceled";
                }
            }

            transactions.markModified("subscriptions");
            await transactions.save();

            res.status(200).json({ message: "Abonnement succesvol geannuleerd" });
        } else {
            res.status(404).json({ message: "Er is geen gebruiker gevonden met dit id" });
        }
    });
}

const purchaseProduct = async (product, user) => {
    if (product.recurring) {
        return await startSubscription(product, user);
    } else {
        return await createPayment(product, user);
    }
}

const startSubscription = async (product, user) => {
    if (!hasSubscription(user)) {
        try {
            //Create first payment to start the scubscription
            const payment = await mollieClient.createFirstPayment(product, user);
            const checkOutUrl = payment.getCheckoutUrl();
            return { checkOutUrl: checkOutUrl };
        } catch (err) {
            console.log(err);
            return { message: "U heeft dit abonnement al gekocht" };
        }
    } else {
        return { message: "Gebruiker heeft al een abonnement" };
    }
}

const hasSubscription = (user) => {
    if (user.subscriptions.length > 0) {
        return true;
    }
    return false;
}

const createSubscription = async (user, customerId, amount, description) => {
    //Create subscription with mollie api
    const webhookUrl = config.webhookUrl + "/api/product/subscriptions/webhook";
    const subscription = await mollieClient.createSubscription(customerId, amount, description, webhookUrl);

    let subscriptions = user.subscriptions;
    subscriptions.push({ description: description, subscriptionId: subscription.id });

    await User.updateOne({ _id: user.id }, { $set: { subscriptions: subscriptions } });
    return subscription;
}

const cancelSubscription = async (user, subscriptionId) => {
    const customerId = user.customerId;
    const subscription = await mollieClient.cancelSubscription(subscriptionId, customerId);
    return subscription;
}

const savePaymentData = async (customerId, payment) => {
    const paymentId = payment.id;
    const description = payment.description;
    const createdAt = payment.createdAt;
    const status = payment.status;
    const amount = payment.amount;
    const method = payment.method;

    const transactions = await Transactions.findOne({ customerId: customerId });
    transactions.transactions.push({
        paymentId: paymentId,
        description: description,
        amount: amount,
        paidAt: createdAt,
        status: status,
        method: method
    });

    transactions.markModified("transactions");
    await transactions.save();
}

const saveSubscriptionData = async (customerId, subscription) => {
    const createdAt = subscription.createdAt;
    const description = subscription.description;
    const amount = subscription.amount;
    const id = subscription.id;

    const transactions = await Transactions.findOne({ customerId: customerId });

    let exists = false;
    let subscriptionInfo;
    for (i in transactions.subscriptions) {
        let subscription = transactions.subscriptions[i];
        if (subscription.subscriptionId == id) {
            subscriptionInfo = subscription;
            exists = true;
        }
    }

    if (!exists) {
        transactions.subscriptions.push({
            subscriptionId: id,
            status: "active",
            startDate: subscription.startDate,
            description,
            amount,
            createdAt,
            payments: []
        })
    } else {
        console.log("Subscription bestaat al!");
    }
    await transactions.save();
}

const isAdmin = async (userId) => {
    const user = await User.findOne({ _id: userId });
    if (user) {
        if (user.isEmployee) {
            return true;
        }
        return false;
    } else {
        return false;
    }
}

const createPayment = async (product, user) => {
    const price = product.price;
    const description = product.productName;
    const redirectUrl = config.webhookUrl + "/producten/succes/" + product.id + "";
    const webHookUrl = config.webhookUrl + "/api/product/webhook";
    const productId = product.id;
    const customerId = user.customerId;

    let payment = await mollieClient.createPayment(price, description, redirectUrl, webHookUrl, productId, user.id, customerId, "oneoff");
    let checkOutUrl = payment.getCheckoutUrl();
    return { checkOutUrl };
}

module.exports.gift = async (req, res) => {
    const id = req.params.id;
    const userId = req.body.userId;
    const userEmail = req.body.email;
    const reqId = JSON.parse(req.cookies.user).id;
    const productId = req.params.id;

    if (!await isAdmin(reqId)) {
        if (id && userId) {
            Product.findOne({ _id: id }, async (err, product) => {
                if (product) {
                    User.findOne({ email: userEmail }, async (err, user) => {
                        if (user) {
                            const checkOutUrl = await createPayment(product, user);
                            res.status(200).json({ redirectUrl: checkOutUrl });
                        } else {
                            res.status(400).json({ message: "Geen gebruiker gevonden met dit e-mail adres" })
                        }
                    })
                } else {
                    res.status(400).json({ message: "Er is geen product gevonden met dit Id" });
                }
            });
        } else {
            res.status(400).json({ message: "Er mist een userId of productId" });
        }
    } else {
        User.findOne({ _id: userId }, async (err, user) => {
            if (user) {
                Product.findOne({ _id: productId }, (err, product) => {
                    if (product) {
                        addClassPass(user, product, "gift");
                        res.status(200).json({ message: "Product succesvol gegeven aan: " + user.fullName });
                    } else {
                        res.status(400).json({ message: "Geen product gevonden met dit id" })
                    }
                });
            } else {
                res.status(400).json({ message: "Geen gebruiker gevonden met dit id" })
            }
        })
    }
}

module.exports.succes = async (req, res) => {
    res.send("succes!")
}

const addClassPass = async (user, product) => {
    //Add class pass hours to users class pass
    if (product.amountOfHours) {
        const newSaldo = user.classPassHours += product.amountOfHours;
        await User.updateOne({ _id: user.id }, { $set: { classPassHours: newSaldo } });
    }
}

module.exports.webHook = async (req, res) => {
    const paymentId = req.body.id;
    const payment = await mollieClient.getPaymentInfo(paymentId);
    const productId = payment.metadata.productId;
    const product = await Product.findOne({ _id: productId });
    const userId = payment.metadata.userId;
    const user = await User.findOne({ _id: userId });
    const customerId = payment.customerId;

    if (await mollieClient.isPaid(paymentId)) {
        if (product) {
            if (!product.recurring) {
                //Normal payment
                if (user) {
                    await addClassPass(user, product);
                    await savePaymentData(customerId, payment);

                    //TODO: Send confirmation mail
                    res.sendStatus(200);
                }
            } else {
                if (payment.sequenceType == "first") {
                    //Subscription payment
                    const customerId = payment.customerId;
                    const amount = payment.amount.value;
                    const description = payment.description;

                    const subscription = await createSubscription(user, customerId, amount, description);
                    await saveSubscriptionData(customerId, subscription);

                    const transactions = await Transactions.findOne({ customerId: customerId });
                    for (i in transactions.subscriptions) {
                        let subscription = transactions.subscriptions[i];
                        if (subscription.description == payment.description) {
                            subscription.payments.push({
                                paymentId: payment.id,
                                description: payment.description,
                                amount: payment.amount,
                                paidAt: payment.paidAt,
                                status: payment.status,
                                method: payment.method
                            });
                        }
                    }
                    transactions.markModified("subscriptions")
                    await transactions.save();
                }
                res.sendStatus(200);
            }
        }
    } else {
        console.log("Nog niet betaald");
    }

}

module.exports.subscriptionWebhook = async (req, res) => {
    const id = req.body.id;
    const payment = await mollieClient.getPaymentInfo(id);
    const customerId = payment.customerId;
    const transactions = await Transactions.findOne({ customerId: customerId });

    if (transactions) {
        let subscriptions = transactions.subscriptions;
        for (i in subscriptions) {
            let subscription = subscriptions[i];
            if (subscription.subscriptionId == payment.subscriptionId) {
                subscription.payments.push({
                    paymentId: payment.id,
                    description: payment.description,
                    amount: payment.amount,
                    paidAt: payment.createdAt,
                    status: payment.status,
                    method: payment.method
                });
            }
        }

        transactions.markModified("subscriptions");
        await transactions.save();
    }

    res.sendStatus(200);
}

module.exports.view = (req, res) => {
    res.render(path.join(__dirname, "../views/products"));
}