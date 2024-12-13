var express = require("express");
var router = express.Router();
const LabmasterRoutes = require("../controller/labmasterController");

router.post("/", LabmasterRoutes.createThread);
router.get("/allholiday/:userId", LabmasterRoutes.getServices);
router.get("/reference/:referenceId", LabmasterRoutes.getServicesbyId);
router.put("/update/:referenceId", LabmasterRoutes.updateThreads);
router.delete("/delete/:referenceId", LabmasterRoutes.deleteThread);

module.exports = router;
