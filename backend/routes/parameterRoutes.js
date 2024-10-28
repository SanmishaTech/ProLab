var express = require("express");
var router = express.Router();
const parameterController = require("../controller/parameter");

router.post("/", parameterController.createThread);
router.get("/allparameter", parameterController.getServices);
router.put("/update/:parameterId", parameterController.updateThreads);
router.delete("/delete/:parameterId", parameterController.deleteThread);
router.get("/reference/:parameterId", parameterController.getServicesbyId);

module.exports = router;
