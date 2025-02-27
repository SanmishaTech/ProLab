var express = require("express");
var router = express.Router();
const UnitmasterController = require("../controller/unitmaster");

router.post("/", UnitmasterController.createThread);
router.get("/allunitmaster/:userId", UnitmasterController.getServices);
router.put("/update/:reasonId", UnitmasterController.updateThreads);
router.delete("/delete/:reasonId", UnitmasterController.deleteThread);
router.get("/reference/:reasonId", UnitmasterController.getServicesbyId);

module.exports = router;
