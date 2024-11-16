var express = require("express");
var router = express.Router();
const machineController = require("../controller/containerLinkMaster");

router.post("/", machineController.createThread);
router.get("/allcontainerlinkmaster", machineController.getServices);
router.get("/reference/:machineId", machineController.getServicesbyId);
router.put("/update/:machineId", machineController.updateThreads);
router.delete("/delete/:machineId", machineController.deleteThread);

module.exports = router;
