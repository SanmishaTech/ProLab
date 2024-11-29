var express = require("express");
var router = express.Router();
const containerController = require("../controller/containerController");

router.post("/", containerController.createThread);
router.get("/allcontainer/:userId", containerController.getServices);
router.get("/reference/:referenceId", containerController.getServicesbyId);
router.put("/update/:departmentId", containerController.updateThreads);
router.delete("/delete/:specimenId", containerController.deleteThread);

module.exports = router;
