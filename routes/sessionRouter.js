const express = require("express");
const router = express.Router();
const controller = require("../controllers/sessionController");
const { validateJwt } = require("../middleware/validator");
const { validateAdmin } = require("../middleware/validator");

//Accessible by anyone
//Get all sessions ->
router.get("/", controller.get);
//Get single session ->
router.get("/:id", controller.get);

//Accessible by logged in user
router.use(validateJwt);
//Signs a user in for a session ->
router.post("/signup/:id", controller.signup);
//Signs a user out for a session ->
router.post("/signout/:id", controller.signout);

//Acceissible by admin
router.use(validateAdmin);
//Add new session ->
router.post("/", controller.add);
//Updates a session ->
router.put("/:id", controller.update);
//Deletes a session ->
router.delete("/:id", controller.delete);

//Statistics routes ->
//Get sessions ordered by how populair a session is->

//Get sessions ordered by most populair day -> 

module.exports = router;