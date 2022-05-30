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
    try {
        const product = await Product.create(req.body);
        res.status(200).json({ id: product.id });
    } catch (err) {
        const error = handleUserErrors(err);
        res.status(400).json(error);
    }
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
                const price = product.price;
                const discription = product.productName;
                const redirectUrl = config.ngrok.url + "/api/product/succes/" + product._id + "";
                const webHookUrl = config.ngrok.url + "/api/product/webhook";
                const productId = product.id;

                let payment = await mollieClient.createPayment(price, discription, redirectUrl, webHookUrl, productId, userId);
                let checkOutUrl = payment.getCheckoutUrl();
                res.status(200).json({ redirectUrl: checkOutUrl });
            } else {
                res.status(400).json({ message: "Er is geen product gevonden met dit Id" });
            }
        });
    } else {
        res.status(400).json({ message: "Er mist een userId of productId" });
    }
}

module.exports.succes = async (req, res) => {
    res.send("succes!")
}

const addClassPass = async (user, product, paymentId) => {
    const expireDate = getExpireDate(product.validFor);
    //Add to purchases array ->
    user.purchases.push({ productId: product.id, expireDate: expireDate, paymentId: paymentId })

    //Add class pass hours to users class pass
    if (product.amountOfHours) {
        user.classPassHours += product.amountOfHours;
    }

    const newSaldo = user.classPassHours += product.amountOfHours;

    await User.updateOne({ _id: user.id }, { $set: { classPassHours: newSaldo } });
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
    const paymentId = req.body.id;

    const payment = await mollieClient.getPaymentInfo(paymentId);
    const productId = payment.metadata.productId;
    const userId = payment.metadata.userId;
    if (payment.isPaid()) {
        User.findOne({ _id: userId }, (err, user) => {
            if (user) {
                Product.findOne({ _id: productId }, (err, product) => {
                    if (product) {
                        addClassPass(user, product, paymentId);
                        //TODO: Send confirmation mail
                        res.sendStatus(200);
                    }
                });
            }
        });
    }
}

module.exports.view = (req, res) => {
    res.render(path.join(__dirname, "../views/products"));
}