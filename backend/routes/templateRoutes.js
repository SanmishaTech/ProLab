var express = require("express");
var router = express.Router();
const templateController = require("../controller/templateController");

router.post("/", templateController.createThread);
router.get(`/alltemplatemaster/:userId`, templateController.getServices);
router.get("/reference/:tatTestId", templateController.getServicesbyId);
router.put("/update/:tatTestId", templateController.updateThreads);
router.delete("/delete/:tatTestId", templateController.deleteThread);

module.exports = router;
