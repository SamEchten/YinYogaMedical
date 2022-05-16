const express = require("express");
const router = express.Router();
const controller = require("../controllers/sessionController");

router.get("/", controller.get);
router.get("/:id", controller.get);
router.post("/", controller.add);
router.put("/:id", controller.update);
router.delete("/:id", controller.delete);
router.post("/:id", controller.cancel);

module.exports = router;