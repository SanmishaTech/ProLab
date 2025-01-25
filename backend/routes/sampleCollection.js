const express = require("express");
const router = express.Router();
const sampleCollectionController = require("../controller/sampleCollectionController");

// Create sample collection entry when registration is done
router.post("/registration/:registrationId", sampleCollectionController.createSampleCollection);

// Get all pending samples
router.get("/pending", sampleCollectionController.getPendingSamples);

// Mark sample as collected
router.put("/:sampleId/collect/:testId", sampleCollectionController.collectSample);

// Handle rejected samples
router.put("/:sampleId/reject/:testId", sampleCollectionController.handleRejectedSample);

module.exports = router; 