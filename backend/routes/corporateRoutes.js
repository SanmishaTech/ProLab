var express = require("express");
var router = express.Router();
const corporateController = require("../controller/corporatemasterController");

router.post("/", corporateController.createThread);
router.get("/allcorporates", corporateController.getServices);
router.get("/reference/:referenceId", corporateController.getServicesbyId);
router.put("/update/:corporateId", corporateController.updateThreads);
router.delete("/delete/:specimenId", corporateController.deleteThread);

module.exports = router;
