var express = require("express");
var router = express.Router();
const machineController = require("../controller/machineLinkMaster");

router.post("/", machineController.createThread);
router.get("/allmachinelinkmaster/:userId", machineController.getServices);
router.get("/reference/:machineId", machineController.getServicesbyId);
router.put("/update/:machineId", machineController.updateThreads);
router.get("/search/:userId", machineController.searchdepartment);
router.delete("/delete/:machineId", machineController.deleteThread);

module.exports = router;
