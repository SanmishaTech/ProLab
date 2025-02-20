var express = require("express");
var router = express.Router();
const clinicHistoryController = require("../controller/clienthistoryController");

router.post("/", clinicHistoryController.createThread);
router.get("/alldepartment/:userId", clinicHistoryController.getServices);
router.get("/reference/:referenceId", clinicHistoryController.getServicesbyId);
router.put("/update/:departmentId", clinicHistoryController.updateThreads);
router.delete("/delete/:doctorId", clinicHistoryController.deleteThread);

module.exports = router;
