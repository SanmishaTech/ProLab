var express = require("express");
var router = express.Router();
const medicationhistoryController = require("../controller/medicationhistoryController");

router.post("/", medicationhistoryController.createThread);
router.get(
  "/allmedicationhistory/:userId",
  medicationhistoryController.getServices
);
router.get(
  "/reference/:parameterId",
  medicationhistoryController.getServicesbyId
);
router.put("/update/:parameterId", medicationhistoryController.updateThreads);
router.delete("/delete/:parameterId", medicationhistoryController.deleteThread);

module.exports = router;
