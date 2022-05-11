const express = require("express");
const router = express.Router();

router.use(express.json());

//Get all users
router.get("/", async (req, res) => {
    res.send("get user");
}); 

//Get user by id
router.get("/:id", async (req, res) => {

});

//Create a new user
router.post("/", async (req, res) => {

});

//Update a user by id
router.put("/:id", async (req, res) => {

});

//Delete a user by id
router.delete("/:id", async (req, res) => {

});

module.exports = router;