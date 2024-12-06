var express = require("express");
var router = express.Router();
const discountMasterController = require("../controller/discountMasterController");

router.post("/", discountMasterController.createThread);
router.get("/alldiscount/:userId", discountMasterController.getServices);
router.get("/reference/:discountId", discountMasterController.getServicesbyId);
router.put("/update/:discountId", discountMasterController.updateThreads);
router.delete("/delete/:discountId", discountMasterController.deleteThread);
router.get("/discountType", discountMasterController.getDiscountsByType);

module.exports = router;
