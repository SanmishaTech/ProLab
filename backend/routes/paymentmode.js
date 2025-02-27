var express = require("express");
var router = express.Router();
const PaymentmodeController = require("../controller/paymentmode");

router.post("/", PaymentmodeController.createThread);
router.get("/allpaymentmode/:userId", PaymentmodeController.getServices);
router.put("/update/:reasonId", PaymentmodeController.updateThreads);
router.delete("/delete/:reasonId", PaymentmodeController.deleteThread);
router.get("/reference/:reasonId", PaymentmodeController.getServicesbyId);

module.exports = router;
