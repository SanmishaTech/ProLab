const express = require("express");
const router = express.Router();
const accessionController = require("../controller/accessionController");

// Create accession entry for a collected sample
router.post("/sample/:sampleId/test/:testId", accessionController.createAccession);

// Get all pending accessions
router.get("/pending", accessionController.getPendingAccessions);

// Approve an accession
router.put("/:accessionId/approve", accessionController.approveAccession);

// Reject an accession
router.put("/:accessionId/reject", accessionController.rejectAccession);

module.exports = router; 