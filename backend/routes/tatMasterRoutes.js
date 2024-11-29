var express = require("express");
var router = express.Router();
const tatController = require("../controller/tatController");

router.post("/", tatController.createThread);
router.get(`/alltatmaster/:userId`, tatController.getServices);
router.get("/reference/:tatTestId", tatController.getServicesbyId);
router.put("/update/:tatTestId", tatController.updateThreads);
router.delete("/delete/:tatTestId", tatController.deleteThread);

module.exports = router;
