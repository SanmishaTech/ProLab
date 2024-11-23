var express = require("express");
var router = express.Router();
const roleMasterController = require("../controller/roleMasterController");

router.post("/", roleMasterController.createThread);
router.get("/allrole/", roleMasterController.getServices);
router.get("/reference/:roleId", roleMasterController.getServicesbyId);
router.put("/update/:roleId", roleMasterController.updateThreads);
router.delete("/delete/:roleId", roleMasterController.deleteThread);

module.exports = router;
