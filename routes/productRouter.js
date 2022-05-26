const express = require("express");
const router = express.Router();
const controller = require("../controllers/productController");
const { validateJwt } = require("../middleware/validator");
const { validateAdmin } = require("../middleware/validator");


router.use(express.json());

//TODO: add admin validation
//Use jwt validation
//router.use(validateJwt);

//Get all products
router.get("/", controller.get);
//Get Single product by id
router.get("/:id", controller.get);

//router.use(validateAdmin);

//Add new product
router.post("/", controller.add);
//Update product
router.put("/:id", controller.update);
//Delete product
router.delete("/:id", controller.delete);
//Buy product
router.post("/purchase/:id", controller.purchase);
//Succes page after payments is succesfull
router.get("/succes/:id", controller.succes);
//Webhook for mollie to send payment info to
router.post("/webhook", controller.webHook);

module.exports = router;