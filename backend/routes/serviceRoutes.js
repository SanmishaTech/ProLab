var express = require("express");
var router = express.Router();
const Servicescontroller = require("../controller/servicesController");

router.post("/", Servicescontroller.createThread);
router.get("/allservices/:userId", Servicescontroller.getServices);
router.get("/service/:serviceId", Servicescontroller.getServicesbyId);
router.put("/update/:serviceId", Servicescontroller.updateThreads);
// router.delete("/delete/:serviceId", Servicescontroller.deleteThread);

module.exports = router;
