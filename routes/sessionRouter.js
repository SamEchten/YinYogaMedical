const express = require("express");
const router = express.Router();
const controller = require("../controllers/sessionController");

router.get("/", controller.get);
router.get("/:id", controller.get);
router.post("/", controller.add);
router.post("/signup/:id", controller.signup);
router.post("/signout/:id", controller.signout);
router.put("/:id", controller.update);
router.delete("/:id", controller.delete);

module.exports = router;