var express = require("express");
var router = express.Router();
const highlighterController = require("../controller/highlighterController");

router.post("/", highlighterController.createThread);
router.get("/allhighlighter", highlighterController.getServices);
router.put("/update/:highlighterId", highlighterController.updateThreads);
router.get("/reference/:highlighterId", highlighterController.getServicesbyId);
router.delete("/delete/:highlighterId", highlighterController.deleteThread);


module.exports = router;
