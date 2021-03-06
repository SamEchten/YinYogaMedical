const express = require("express");
const router = express.Router();
const controller = require("../controllers/productController");
const { validateJwt } = require("../middleware/validator");
const { validateAdmin } = require("../middleware/validator");

//Accessible by anyone (mollie api)
//Webhook for mollie to send payment info to
router.post("/webhook", controller.webHook);
//Webhook for mollie to send subscription info to
router.post("/subscriptions/webhook", controller.subscriptionWebhook);
//Get all products
router.get("/", controller.get);
//Get Single product by id
router.get("/:id", controller.get);

//Accessible by logged in users
router.use(validateJwt);
//Buy product
router.post("/purchase/:id", controller.purchase);
//Cancel subscription
router.post("/cancel/:id", controller.cancel);
//Gift product
router.post("/gift/:id", controller.gift);

//Accessible by admin
router.use(validateAdmin);
//Add new product
router.post("/", controller.add);
//Update product
router.put("/:id", controller.update);
//Delete product
router.delete("/:id", controller.delete);

module.exports = router;