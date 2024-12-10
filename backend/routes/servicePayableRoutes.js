var express = require("express");
var router = express.Router();
const associateController = require("../controller/servicePayableController");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });

router.post("/", associateController.createThread);
router.get("/allservicepayable/:userId", associateController.getServices);
router.get("/reference/:referenceId", associateController.getServicesbyId);
router.post(
  "/upload-csv",
  upload.single("file"),
  associateController.uploadCSV
);
router.put("/update/:associateId", associateController.updateThreads);
router.delete("/delete/:specimenId", associateController.deleteThread);

module.exports = router;
