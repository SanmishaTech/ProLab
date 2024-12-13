var express = require("express");
var router = express.Router();
const collectionMaster = require("../controller/collectionMasterController");

router.post("/", collectionMaster.createThread);
router.get("/allcollectionmaster/:userId", collectionMaster.getServices);
router.put("/update/:collectionMaster", collectionMaster.updateThreads);
router.get("/reference/:collectionMaster", collectionMaster.getServicesbyId);
router.delete("/delete/:collectionMaster", collectionMaster.deleteThread);

module.exports = router;
