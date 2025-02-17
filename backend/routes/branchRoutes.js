var express = require("express");
var router = express.Router();
const branchController = require("../controller/branchController");

router.post("/", branchController.createThread);
router.get("/allbarcode/:userId", branchController.getServices);
router.put("/update/:barcodeId", branchController.updateThreads);
router.get("/reference/:barcodeId", branchController.getServicesbyId);

module.exports = router;
