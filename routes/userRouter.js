const express = require("express");
const router = express.Router();
const controller = require("../controllers/userController");

router.use(express.json());

router.get("/", controller.get); 
router.get("/:id", controller.get);
router.post("/", controller.add);
router.put("/:id", controller.update);
router.delete("/:id", controller.delete);

module.exports = router;