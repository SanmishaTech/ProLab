var express = require("express");
var router = express.Router();
const barcodeController = require("../controller/barcodeController");

router.post("/", barcodeController.createThread);
router.get("/allbarcode", barcodeController.getServices);
router.put("/update/:barcodeId", barcodeController.updateThreads);
router.get("/reference/:barcodeId", barcodeController.getServicesbyId);

module.exports = router;
