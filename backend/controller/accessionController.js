const Accession = require("../Schema/accession");
const SampleCollection = require("../Schema/samplecollectionmaster");

exports.createAccession = async (req, res) => {
  try {
    const { sampleId, testId } = req.params;
    
    // Find the sample collection entry
    const sample = await SampleCollection.findById(sampleId);
    if (!sample) {
      return res.status(404).json({ error: "Sample not found" });
    }

    // Check if test exists and is collected
    const testIndex = sample.tests.findIndex(
      test => test.test.toString() === testId && test.status === "collected"
    );
    if (testIndex === -1) {
      return res.status(404).json({ error: "Test not found or not collected" });
    }

    // Create accession entry
    const accession = new Accession({
      registrationId: sample.registrationId,
      testId: testId,
      sampleId: sampleId,
      userId: req.body.userId
    });

    await accession.save();
    res.status(201).json(accession);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getPendingAccessions = async (req, res) => {
  try {
    const accessions = await Accession.find({ status: "pending" })
      .populate("registrationId")
      .populate("testId")
      .populate("sampleId");
    
    res.json(accessions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.approveAccession = async (req, res) => {
  try {
    const accession = await Accession.findById(req.params.accessionId);
    if (!accession) {
      return res.status(404).json({ error: "Accession not found" });
    }

    accession.status = "approved";
    accession.processedAt = new Date();
    await accession.save();

    res.json(accession);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.rejectAccession = async (req, res) => {
  try {
    const { accessionId } = req.params;
    const { rejectionReason } = req.body;

    const accession = await Accession.findById(accessionId);
    if (!accession) {
      return res.status(404).json({ error: "Accession not found" });
    }

    // Update accession status
    accession.status = "rejected";
    accession.rejectionReason = rejectionReason;
    accession.processedAt = new Date();
    await accession.save();

    // Update sample collection status
    const sample = await SampleCollection.findById(accession.sampleId);
    if (sample) {
      const testIndex = sample.tests.findIndex(
        test => test.test.toString() === accession.testId.toString()
      );
      if (testIndex !== -1) {
        sample.tests[testIndex].status = "rejected";
        sample.tests[testIndex].rejectionReason = rejectionReason;
        await sample.save();
      }
    }

    res.json(accession);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}; 