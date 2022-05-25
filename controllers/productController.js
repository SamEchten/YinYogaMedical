const Product = require("../models/Product");
const { handleUserErrors } = require("./errorHandler");
const mollieClient = require("../mollie/mollieClient");
const config = require("../config").config;
const path = require("path");
const Session = require("../models/Session");

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
        Product.findOne({ id }, async (err, product) => {
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
        Product.findOne({ id }, async (err, product) => {
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
        Product.findOne({ id }, (err, product) => {
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
        Product.findOne({ id }, async (err, product) => {
            if (product) {
                const price = product.price;
                const discription = product.productName;
                const redirectUrl = config.ngrok.url + "/api/product/succes/" + product._id + "";
                const webHookUrl = config.ngrok.url + "/api/product/webhook/";
                const productId = product._id;

                const payment = await mollieClient.createPayment(price, discription, redirectUrl, webHookUrl, productId);
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
    //Update User document
    //Return status to user
    res.send(req.params);
}

module.exports.webHook = async (req, res) => {
    console.log(req);
    res.sendStatus(200);
}

module.exports.view = (req, res) => {
    res.render(path.join(__dirname, "../views/products"));
}