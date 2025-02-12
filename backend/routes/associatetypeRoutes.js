var express = require("express");
var router = express.Router();
const associatetypeController = require("../controller/associatetypeController");

router.post("/", associatetypeController.createThread);
router.get("/allassociatetype/:userId", associatetypeController.getServices);
router.get("/reference/:referenceId", associatetypeController.getServicesbyId);
router.put("/update/:associateId", associatetypeController.updateThreads);
router.delete("/delete/:specimenId", associatetypeController.deleteThread);

module.exports = router;
