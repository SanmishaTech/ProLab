const express = require("express");
const router = express.Router();
const prefixController = require("../controller/prefixController");

router.post("/", prefixController.createPrefix);

router.get("/:prefixFor", prefixController.getPrefixesByType);

router.get("/:prefixFor/:id", prefixController.getPrefixByIdAndType);

router.put("/:prefixFor/:id", prefixController.updatePrefixByType);

router.delete("/:prefixFor/:id", prefixController.deletePrefixByType);

module.exports = router;
