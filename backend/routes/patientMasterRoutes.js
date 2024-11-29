var express = require("express");
var router = express.Router();
const patientMasterController = require("../controller/patientMasterController");

router.post("/", patientMasterController.createThread);
router.get("/allpatients/:userId", patientMasterController.getServices);
router.get("/reference/:patientId", patientMasterController.getServicesbyId);
router.put("/update/:patientId", patientMasterController.updateThreads);
router.delete("/delete/:patientId", patientMasterController.deleteThread);
router.get("/filter", patientMasterController.getPatientByPriorityCard);
router.get("/search/:name/:userId", patientMasterController.searchbyName);

module.exports = router;
