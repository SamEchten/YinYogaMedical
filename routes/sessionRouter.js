const express = require("express");
const router = express.Router();
const controller = require("../controllers/sessionController");
const { validateJwt } = require("../middleware/validator");

//Get all sessions ->
router.get("/", controller.get);
//Get single session ->
router.get("/:id", validateJwt, controller.get);
//Get all session of user, userId is given ->
router.get("/byUser/:id", validateJwt, controller.getByUserId);
//Add new session ->
router.post("/", validateJwt, controller.add);
//Signs a user in for a session ->
router.post("/signup/:id", validateJwt, controller.signup);
//Signs a user out for a session ->
router.post("/signout/:id", validateJwt, controller.signout);
//Updates a session ->
router.put("/:id", validateJwt, controller.update);
//Deletes a session ->
router.delete("/:id", validateJwt, controller.delete);

//Statistics routes ->
//Get sessions ordered by how populair a session is->

//Get sessions ordered by most populair day -> 

module.exports = router;