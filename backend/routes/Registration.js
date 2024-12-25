var express = require("express");
var router = express.Router();
const Registration = require("../controller/registrationController");

router.post("/", Registration.createThread);
router.get("/allregistration/:userId", Registration.getServices);
router.get("/reference/:referenceId", Registration.getServicesbyId);
router.put("/update/:referenceId", Registration.updateThreads);
router.post("/payment", Registration.createpayment);
// router.delete("/delete/:serviceId", Servicescontroller.deleteThread);

module.exports = router;
