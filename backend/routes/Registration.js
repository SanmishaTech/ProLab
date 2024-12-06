var express = require("express");
var router = express.Router();
const referenceController = require("../controller/registrationController");

router.post("/", referenceController.createThread);
router.get("/allregistration/:userId", referenceController.getServices);
router.get("/reference/:referenceId", referenceController.getServicesbyId);
router.put("/update/:referenceId", referenceController.updateThreads);
// router.delete("/delete/:serviceId", Servicescontroller.deleteThread);

module.exports = router;
