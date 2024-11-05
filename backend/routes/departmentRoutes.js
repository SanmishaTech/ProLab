var express = require("express");
var router = express.Router();
const departmentController = require("../controller/departmentController");

router.post("/", departmentController.createThread);
router.get("/alldepartment", departmentController.getServices);
router.get("/reference/:referenceId", departmentController.getServicesbyId);
router.put("/update/:departmentId", departmentController.updateThreads);
// router.delete("/delete/:serviceId", Servicescontroller.deleteThread);

module.exports = router;
