var express = require("express");
var router = express.Router();
const patientController = require("../controller/patientController");

router.post("/", patientController.createThread);
router.get("/allpatient/:userId", patientController.getServices);
router.get("/patient/:patientId", patientController.getServicesbyId);
router.put("/update/:patientId", patientController.updateThreads);
router.get("/search/:name/:userId", patientController.searchbyName);

// router.delete("/delete/:serviceId", Servicescontroller.deleteThread);

module.exports = router;
