const express = require("express");
const router = express.Router();
const controller = require("../controllers/sessionController");

router.get("/session", controller.get);
router.post("/session", controller.add);
router.put("/session", controller.update);
router.delete("/session", controller.delete);

module.exports = router;