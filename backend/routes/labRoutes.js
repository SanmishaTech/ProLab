var express = require("express");
var router = express.Router();
const LabMaster = require("../controller/refferedBy");

router.post("/", referenceController.createThread);
router.get("/", referenceController.getServices);
router.get("/reference/:referenceId", referenceController.getServicesbyId);
router.put("/update/:referenceId", referenceController.updateThreads);
// router.delete("/delete/:serviceId", Servicescontroller.deleteThread);

module.exports = router;
