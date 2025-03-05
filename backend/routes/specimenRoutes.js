var express = require("express");
var router = express.Router();
const specimenController = require("../controller/specimenController");

router.post("/", specimenController.createThread);
router.get("/allspecimen/:userId", specimenController.getServices);
router.get("/reference/:departmentId", specimenController.getServicesbyId);
router.put("/update/:departmentId", specimenController.updateThreads);
router.get("/search/:userId", specimenController.searchdepartment);
router.delete("/delete/:specimenId", specimenController.deleteThread);

module.exports = router;
