var express = require("express");
var router = express.Router();
const holidayController = require("../controller/holidayController");

router.post("/", holidayController.createThread);
router.get("/allholiday/:userId", holidayController.getServices);
router.get("/reference/:referenceId", holidayController.getServicesbyId);
router.put("/update/:referenceId", holidayController.updateThreads);
// router.delete("/delete/:serviceId", Servicescontroller.deleteThread);

module.exports = router;
