var express = require("express");
var router = express.Router();
const promoCodeMasterController = require("../controller/promoCodeMasterController");

router.post("/", promoCodeMasterController.createThread);
router.get("/allpromocode", promoCodeMasterController.getServices);
router.get("/reference/:promocodeId", promoCodeMasterController.getServicesbyId);
router.put("/update/:promocodeId", promoCodeMasterController.updateThreads);
router.delete("/delete/:promocodeId", promoCodeMasterController.deleteThread);

module.exports = router;
