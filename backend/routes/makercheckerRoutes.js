var express = require("express");
var router = express.Router();
const MakercheckerController = require("../controller/makercheckerController");

router.post("/", MakercheckerController.createThread);
router.get("/allmakerchecker/:userId", MakercheckerController.getServices);
router.get("/reference/:machineId", MakercheckerController.getServicesbyId);
router.put("/update/:machineId", MakercheckerController.updateThreads);
router.delete("/delete/:machineId", MakercheckerController.deleteThread);

module.exports = router;
