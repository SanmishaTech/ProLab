var express = require("express");
var router = express.Router();
const departmentController = require("../controller/departmentController");

router.post("/", departmentController.createThread);
router.get("/alldepartment/:userId", departmentController.getServices);
router.get("/reference/:referenceId", departmentController.getServicesbyId);
router.put("/update/:referenceId", departmentController.updateThreads);
// router.delete("/delete/:serviceId", Servicescontroller.deleteThread);

module.exports = router;
