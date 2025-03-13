var express = require("express");
var router = express.Router();
const ratecardController = require("../controller/ratecardController");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });

router.post("/", ratecardController.createThread);
router.get("/allservicepayable/:userId", ratecardController.getServices);
router.get("/reference/:referenceId", ratecardController.getServicesbyId);
// router.post(
//   "/upload-csv",
//   upload.single("file"),
//   ratecardController.uploadCSV
// );
router.post("/getassociate/:userId", ratecardController.getAssociates);
router.put("/update/:associateId", ratecardController.updateThreads);
router.delete("/delete/:specimenId", ratecardController.deleteThread);

module.exports = router;
