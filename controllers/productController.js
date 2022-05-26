const Product = require("../models/Product");
const { handleUserErrors } = require("./errorHandler");
const mollieClient = require("../mollie/mollieClient");
const config = require("../config").config;
const path = require("path");
const Session = require("../models/Session");
const User = require("../models/User");

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
                res.status(200).json(products);
            } else {
                res.status(400).json({ message: "Er is iets fout gegaan", error: err });
            }
        });
    } catch (err) {
        res.status(400).json({ message: "Er is iets fout gegaan", error: err });
    }
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
                await Product.updateOne({ id }, { $set: body });
                res.status(200).json({ productId: product.id });
            } else {
                res.status(404).json({ message: "Er is geen product gevonden met dit id" });
            }
        });
    } catch (err) {

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

                let payment = await mollieClient.createPayment(price, discription, redirectUrl, webHookUrl, productId);
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

const addClassPass = async (user, product) => {
    //Add to purchases array ->
    const date = new Date();
    const year = date.getFullYear() + product.validFor;
    const month = date.getMonth();
    const day = date.getDate();
    const expireDate = new Date(year, month, day);
    user.purchases.push({ productId: product.id, expireDate: expireDate })

    //Add class pass hours to users class pass
    if (product.amountOfHours) {
        user.classPassHours += product.amountOfHours;
    }

    user.save();
}

module.exports.webHook = async (req, res) => {
    console.log(req.body);
    res.sendStatus(200);
    //const userId = req.body.userId;
    //const productId = req.params.id;
    const succeed = false;
    //Update User document
    //Return status to user
    if (succeed) {
        res.send(req.params);
        User.findOne({ _id: userId }, (err, user) => {
            if (user) {
                Product.findOne({ _id: productId }, (err, product) => {
                    if (product) {
                        addClassPass(user, product);
                    } else {
                        res.status(400).json({ message: "Geen product gevonden met dit id" });
                    }
                });
            } else {
                res.status(400).json({ message: "Geen gebruiker gevonden met dit id" })
            }
        });
    }
}

module.exports.view = (req, res) => {
    res.render(path.join(__dirname, "../views/products"));
}