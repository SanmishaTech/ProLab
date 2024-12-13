var express = require("express");
var router = express.Router();
const containerLinkMaster = require("../controller/containerLinkMaster");

router.post("/", containerLinkMaster.createThread);
router.get("/allcontainerlinkmaster", containerLinkMaster.getServices);
router.get("/reference/:machineId", containerLinkMaster.getServicesbyId);
router.put("/update/:machineId", containerLinkMaster.updateThreads);
router.delete("/delete/:machineId", containerLinkMaster.deleteThread);

module.exports = router;
