var express = require("express");
var router = express.Router();
const parameterGroupController = require("../controller/parameterGroupController");

router.post("/", parameterGroupController.createThread);
router.get("/allparametergroup/:userId", parameterGroupController.getServices);
router.get("/reference/:parameterId", parameterGroupController.getServicesbyId);
router.put("/update/:parameterId", parameterGroupController.updateThreads);
router.get("/search/:userId", parameterGroupController.searchdepartment);
router.delete("/delete/:parameterId", parameterGroupController.deleteThread);

module.exports = router;
