var express = require("express");
var router = express.Router();
const testlinkmasterController = require("../controller/testmasterlinkController");

router.post("/", testlinkmasterController.createThread);
router.get("/allLinkmaster/:userId", testlinkmasterController.getServices);
router.get("/reference/:referenceId", testlinkmasterController.getServicesbyId);
router.get("/search/:userId", testlinkmasterController.searchdepartment);
router.put("/update/:departmentId", testlinkmasterController.updateThreads);
router.delete("/delete/:specimenId", testlinkmasterController.deleteThread);

module.exports = router;
