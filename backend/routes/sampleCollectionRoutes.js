var express = require("express");
var router = express.Router();
const SampleCollection = require("../controller/sampleCollectionController");

router.post("/", SampleCollection.createThread);
router.get(
  `/allsamplemaster/:userId/:Registration`,
  SampleCollection.getServices
);
router.get("/reference/:tatTestId", SampleCollection.getServicesbyId);
router.put("/update/:tatTestId", SampleCollection.updateThreads);
router.delete("/delete/:tatTestId", SampleCollection.deleteThread);

module.exports = router;
