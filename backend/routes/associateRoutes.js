var express = require("express");
var router = express.Router();
const associateController = require("../controller/associateController");

router.post("/", associateController.createThread);
router.get("/allassociates/:userId", associateController.getServices);
router.get("/reference/:referenceId", associateController.getServicesbyId);
router.put("/update/:associateId", associateController.updateThreads);
router.get("/search/:userId", associateController.searchbyName);
router.delete("/delete/:specimenId", associateController.deleteThread);

module.exports = router;
