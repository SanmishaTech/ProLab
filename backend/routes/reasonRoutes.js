var express = require("express");
var router = express.Router();
const reasonController = require("../controller/reasonController");

router.post("/", reasonController.createThread);
router.get("/allreason", reasonController.getServices);
router.put("/update/:reasonId", reasonController.updateThreads);
router.delete("/delete/:reasonId", reasonController.deleteThread);
router.get("/reference/:reasonId", reasonController.getServicesbyId);

module.exports = router;
