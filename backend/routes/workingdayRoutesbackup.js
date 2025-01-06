var express = require("express");
var router = express.Router();
const testMasterController = require("../controller/userMasterController");

router.post("/", testMasterController.createThread);
router.get("/allusermaster/:userId", testMasterController.getServices);
router.get("/reference/:testmasterId", testMasterController.getServicesbyId);

module.exports = router;
