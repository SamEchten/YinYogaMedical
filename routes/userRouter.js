const express = require("express");
const router = express.Router();
const controller = require("../controllers/userController");
const { validateJwt } = require("../middleware/validator");
const { validateAdmin } = require("../middleware/validator");

//Accessible by logged in users
router.use(validateJwt);
//Get single user
router.get("/", controller.get);
//Get all users
router.get("/:id", controller.get);

//Accessible by admin
router.use(validateAdmin);
//Add a new user
router.post("/", controller.add);
//Updated a user with new information
router.put("/:id", controller.update);
//Deletes a user by id
router.delete("/:id", controller.delete);
//Gets the purchase history of a user by id (in params)
router.get("/purchasehistory/:id", controller.purchaseHistory);

module.exports = router;