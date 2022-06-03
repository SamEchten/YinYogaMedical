const Product = require("../models/Product");
const { handleUserErrors } = require("./errorHandler");
const mollieClient = require("../mollie/mollieClient");
const config = require("../config").config;
const path = require("path");
const User = require("../models/User");
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
                        res.status(200).json({ purchaseInfo });
                    } else {
                        res.status(404).json({ message: "Er is geen gebruiker gevonden met id id" })
                    }
                })
            } else {
                res.status(404).json({ message: "Er is geen product gevonden met dit Id" });
            }
        });
    } else {
        res.status(400).json({ message: "Er mist een userId of productId" });
    }
}

const purchaseProduct = async (product, user) => {
    if (product.recurring) {
        return await startSubscription(product, user);
    } else {
        return await createPayment(product, user.id);
    }
}

const startSubscription = async (product, user) => {
    let customerId;
    //Check if user is customer
    if (!isCustomer(user)) {
        customerId = await mollieClient.createCustomer(user.id);
        user = await User.findOne({ _id: user.id });
    } else {
        customerId = user.customerId;
    }

    const hasMandate = await mollieClient.hasMandate(customerId);
    if (!hasMandate) {
        //Create first payment to start the scubscription
        const payment = await mollieClient.createFirstPayment(product, user);
        const checkOutUrl = payment.getCheckoutUrl();
        return { checkOutUrl: checkOutUrl };
    } else {
        //Create normal payment
        const checkOutUrl = await createPayment(product, user);

        //Create subscription
        const amount = product.price;
        const description = product.productName;
        try {
            const subscription = await createSubscription(user, customerId, amount, description);
        } catch (err) {
            return { error: "Abbonement is al gekocht" }
        }
        return { checkOutUrl: checkOutUrl };
    }
}

const createSubscription = async (user, customerId, amount, description) => {
    //Create subscription with mollie api
    const webhookUrl = config.ngrok.url + "/api/product/subscriptions/webhook";
    const subscription = await mollieClient.createSubscription(customerId, amount, description, webhookUrl);
    await saveSubscriptionData(user, subscription);
    return subscription;
}

const saveSubscriptionData = async (user, subscription) => {
    const createdAt = subscription.createdAt;
    const description = subscription.description;
    const amount = subscription.amount;
    const id = subscription.id;

    const subscriptionData = user.subscriptionData;
    let exists = false;
    for (i in subscriptionData) {
        let sub = subscriptionData[i];
        if (sub.id == id) {
            sub.transactions.push({ createdAt, description, amount })
            exists = true;
        }
    }

    if (exists == false) {
        subscriptionData.push({ id: id, transactions: [{ createdAt, description, amount }] });
    }

    await User.updateOne({ _id: user.id }, { $set: { subscriptionData: subscriptionData, subscription: description } });
}

const isCustomer = (user) => {
    if (user) {
        if (user.customerId) {
            return true
        }
    }

    return false;
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
    const discription = product.productName;
    const redirectUrl = config.ngrok.url + "/api/product/succes/" + product._id + "";
    const webHookUrl = config.ngrok.url + "/api/product/webhook";
    const productId = product.id;
    const customerId = user.customerId;

    let payment = await mollieClient.createPayment(price, discription, redirectUrl, webHookUrl, productId, user.id, customerId);
    let checkOutUrl = payment.getCheckoutUrl();
    return checkOutUrl;
}

module.exports.gift = async (req, res) => {
    const id = req.params.id;
    const userId = req.body.userId;
    const userEmail = req.body.email;
    const reqId = JSON.parse(req.cookies.user).userId;
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

const addClassPass = async (user, product, paymentId) => {
    const expireDate = getExpireDate(product.validFor);
    const purchases = user.purchases;
    //Add to purchases array ->
    purchases.push({ productId: product.id, expireDate: expireDate, paymentId: paymentId })

    //Add class pass hours to users class pass
    if (product.amountOfHours) {
        user.classPassHours += product.amountOfHours;
    }

    const newSaldo = user.classPassHours += product.amountOfHours;

    await User.updateOne({ _id: user.id }, { $set: { classPassHours: newSaldo, purchases: purchases } });
}

const getExpireDate = (validFor) => {
    const date = new Date();
    const year = date.getFullYear() + validFor;
    const month = date.getMonth();
    const day = date.getDate();
    const expireDate = new Date(year, month, day, 2);
    return expireDate;
}

module.exports.webHook = async (req, res) => {
    console.log("product webhook");
    const paymentId = req.body.id;

    const payment = await mollieClient.getPaymentInfo(paymentId);
    const productId = payment.metadata.productId;
    const product = await Product.findOne({ _id: productId });
    const userId = payment.metadata.userId;
    const user = await User.findOne({ _id: userId });

    console.log(payment);
    if (await mollieClient.isPaid(paymentId)) {
        if (!product.recurring) {
            //Normal payment=
            if (user) {
                addClassPass(user, product, paymentId);
                //TODO: Send confirmation mail
                res.sendStatus(200);
            }
        } else {
            if (payment.sequenceType == "first") {
                //Subscription payment
                const customerId = payment.customerId;
                console.log(customerId);
                const amount = payment.amount.value;
                const description = payment.description;
                await createSubscription(user, customerId, amount, description);
            }

            res.sendStatus(200);
        }
    } else {
        console.log("Nog niet betaald");
    }

}

module.exports.subscriptionWebhook = async (req, res) => {
    console.log("subscription webhook");
    const id = req.body.id;
    const payment = await mollieClient.getPaymentInfo(id);
    await saveSubscriptionData()
    console.log(payment);
    res.sendStatus(200);
}

module.exports.view = (req, res) => {
    res.render(path.join(__dirname, "../views/products"));
}