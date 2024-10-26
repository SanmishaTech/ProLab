var express = require("express");
var router = express.Router();
const parameterController = require("../controller/parameter");

router.post("/", parameterController.createThread);
router.get("/allparameter", parameterController.getServices);
router.get("/reference/:referenceId", parameterController.getServicesbyId);
router.put("/update/:referenceId", parameterController.updateThreads);
// router.delete("/delete/:serviceId", Servicescontroller.deleteThread);

module.exports = router;
