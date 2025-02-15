var express = require("express");
var router = express.Router();
const servicePayableController = require("../controller/servicePayableController");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });

router.post("/", servicePayableController.createThread);
router.get("/allservicepayable/:userId", servicePayableController.getServices);
router.get("/reference/:referenceId", servicePayableController.getServicesbyId);
router.post(
  "/upload-csv",
  upload.single("file"),
  servicePayableController.uploadCSV
);
router.get(
  "/getassociate/:associateId/:userId",
  servicePayableController.getAssociate
);
router.put("/update/:associateId", servicePayableController.updateThreads);
router.delete("/delete/:specimenId", servicePayableController.deleteThread);

module.exports = router;
