var express = require("express");
var router = express.Router();
const parameterGroupController = require("../controller/parameterGroupController");

router.post("/", parameterGroupController.createThread);
router.get("/allparametergroup", parameterGroupController.getServices);
router.get("/reference/:parameterId", parameterGroupController.getServicesbyId);
router.put("/update/:parameterId", parameterGroupController.updateThreads);
// router.delete("/delete/:serviceId", parameterGroupController.deleteThread);

module.exports = router;
