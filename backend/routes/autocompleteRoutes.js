var express = require("express");
var router = express.Router();
const autocompleteController = require("../controller/autocompleteController");

router.post("/", autocompleteController.createThread);
router.get(
  "/allautocomplete/:parameterId/:userId",
  autocompleteController.getServices,
);
router.put("/update/:registrationId", autocompleteController.updateThreads);
router.get("/reference/:barcodeId", autocompleteController.getServicesbyId);

module.exports = router;
