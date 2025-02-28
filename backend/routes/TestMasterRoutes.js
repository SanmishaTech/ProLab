var express = require("express");
var router = express.Router();
const testMasterController = require("../controller/testMasterController");

router.post("/", testMasterController.createThread);
router.get("/alltestmaster/:userId", testMasterController.getServices);
router.get("/reference/:testmasterId", testMasterController.getServicesbyId);
router.put("/update/:testmasterId", testMasterController.updateThreads);
router.delete("/delete/:testmasterId", testMasterController.deleteThread);
router.get("/search/:userId", testMasterController.searchbyName);

module.exports = router;
