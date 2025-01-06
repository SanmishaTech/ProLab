const express = require("express");
const router = express.Router();
const workingHoursController = require("../controller/workingHoursController");

// Create or update working hours
router.post("/", workingHoursController.createOrUpdate);

// Get working hours for a user
router.get("/:userId", workingHoursController.getWorkingHours);

module.exports = router; 