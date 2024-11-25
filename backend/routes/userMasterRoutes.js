var express = require("express");
var router = express.Router();
const testMasterController = require("../controller/userMasterController");

router.post("/", testMasterController.createThread);
router.get("/allusermaster", testMasterController.getServices);
router.get("/reference/:testmasterId", testMasterController.getServicesbyId);
router.put("/update/:testmasterId", testMasterController.updateThreads);
router.delete("/delete/:testmasterId", testMasterController.deleteThread);

module.exports = router;
