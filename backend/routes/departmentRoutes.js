var express = require("express");
var router = express.Router();
const departmentController = require("../controller/departmentController");

router.post("/", departmentController.createThread);
router.get("/alldepartment/:userId", departmentController.getServices);
router.get("/reference/:referenceId", departmentController.getServicesbyId);
router.put("/update/:departmentId", departmentController.updateThreads);
router.delete("/delete/:doctorId", departmentController.deleteThread);

module.exports = router;
