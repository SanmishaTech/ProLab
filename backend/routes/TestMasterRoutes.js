var express = require("express");
var router = express.Router();
const testMasterController = require("../controller/testMasterController");

router.post("/", testMasterController.createThread);
router.get("/alltestmaster", testMasterController.getServices);
router.get("/reference/:testmasterId", testMasterController.getServicesbyId);
router.put("/update/:testmasterId", testMasterController.updateThreads);
router.delete("/delete/:testmasterId", testMasterController.deleteThread);

module.exports = router;
