const Product = require("../models/Product");
const { handleUserErrors } = require("./errorHandler");
const mollieClient = require("../mollie/mollieClient");

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

}

module.exports.delete = async (req, res) => {

}

module.exports.purchase = async (req, res) => {
    const id = req.params.id;
    const userId = req.body.userId;

    if (id && userId) {
        Product.findOne({ id }, async (err, product) => {
            if (product) {
                const price = product.price;
                const discription = product.productName;
                const redirectUrl = "https://78a5-2a02-a467-14f7-1-28f2-ec4f-48f9-c7fd.eu.ngrok.io/api/product/succes/" + product._id + "";
                const webHookUrl = "https://78a5-2a02-a467-14f7-1-28f2-ec4f-48f9-c7fd.eu.ngrok.io/api/product/webhook";

                const payment = await mollieClient.createPayment(price, discription, redirectUrl, webHookUrl);
                let checkOutUrl = payment.getCheckoutUrl();
                res.status(200).json({ redirectUrl: checkOutUrl });
            } else {
                res.status(400).json({ message: "Er is geen product gevonden met dit Id" });
            }
        });
    } else {
        res.status(400).json({ message: "Er is geen id meegegeven" });
    }


    //Create payment
    //Redirect user to payment page
    //User gets redirected to payment Succes
}

module.exports.succes = async (req, res) => {
    //Update User document
    //Return status to user
    res.send(req.params);
}

module.exports.webHook = async (req, res) => {
    console.log(req.body);
    res.sendStatus(200);
}