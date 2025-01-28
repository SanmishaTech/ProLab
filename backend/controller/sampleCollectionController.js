const SampleCollection = require("../Schema/samplecollectionmaster");
const User = require("../Schema/userSchema");
const mongoose = require("mongoose");
const Test = require("../Schema/testMaster");
const Associate = require("../Schema/associatemaster");
const fs = require("fs");
const csv = require("csv-parser");
const Registration = require("../Schema/registration");

const SampleCollectionController = {
  createThread: async (req, res, next) => {
    try {
      const { Registration, Tests, userId } = req.body;
<<<<<<< HEAD
      const registrationtobefound = new mongoose.Types.ObjectId(Registration);

      const findExistingrecords = await SampleCollection.findOne({
        Registration: registrationtobefound,
      });

      if (findExistingrecords) {
        const existingTests = findExistingrecords.tests || [];

        // Ensure tests are unique
        const newTests = Tests.filter(
          (test) =>
            !existingTests.some(
              (existingTest) => existingTest.test.toString() === test.test
            ) // Match by test ObjectId
        );
        const updatedTests = [...existingTests, ...newTests];

        const updateData = {
          registrationId: Registration,
          userId,
          tests: updatedTests,
        };

        const updateRecord = await SampleCollection.findByIdAndUpdate(
          findExistingrecords._id,
          updateData,
          { new: true }
        );

        if (!updateRecord) {
          return res.status(404).json({ message: "Service not found." });
        }

        // Populate the updated record
        const updatedRecord = await SampleCollection.findById(
          updateRecord._id
=======
      const registrationId = new mongoose.Types.ObjectId(Registration);

      // Check for existing record with the same registrationId
      let existingRecord = await SampleCollection.findOne({ registrationId });

      if (existingRecord) {
        // Merge new tests with existing tests, ensuring no duplicates
        const existingTests = existingRecord.tests || [];
        console.log("existingTests", JSON.stringify(existingTests));
        console.log("Tests", JSON.stringify(Tests));

        const newTests = Tests.filter((newTest) => {
          console.log("Indside the filter", newTest);
          return !existingTests.some((existingTest) => {
            existingTest.test.toString() === newTest.test;
          });
        });
        // existingTest.test.toString() === newTest.test
        console.log("newTests", JSON.stringify(newTests));

        // Add non-duplicate tests
        newTests.forEach((newTest) => {
          existingRecord.tests.push({
            test: newTest.test,
            status: newTest.status,
            rejectionReason: null,
            collectedAt: newTest.collectedAt || null,
            collectedBy: newTest.collectedBy || null,
          });
        });

        console.log("Updated tests", JSON.stringify(existingRecord));

        // Optional: Update userId if needed
        if (userId) existingRecord.userId = userId;

        // Save the updated record
        await existingRecord.save();

        // Populate the updated record
        const populatedRecord = await SampleCollection.findById(
          existingRecord._id
>>>>>>> 7a35450 (asd)
        ).populate({
          path: "tests",
          populate: {
            path: "test",
          },
        });

        return res.json({
<<<<<<< HEAD
          message: "Service updated successfully.",
          updatedRecord,
        });
      }

      // Create a new record if none exists
      const newService = new SampleCollection({
        registrationId: Registration,
        tests: Tests,
        userId,
      });
      const newServiceSaved = await newService.save();

      // Populate the new record
      const updatedRecord = await SampleCollection.findById(
        newServiceSaved._id
=======
          message: "Record updated successfully.",
          populatedRecord,
        });
      }

      console.log("No existing record found", JSON.stringify(Tests));
      // If no existing record, create a new one
      // In SampleCollectionController.js
      const newRecord = new SampleCollection({
        registrationId,
        tests: Tests.map((t) => ({
          test: t.test,
          status: "collected",
          rejectionReason: null,
          collectedAt: t.collectedAt || null,
          collectedBy: t.collectedBy || null,
        })),
        userId,
      });
      const savedRecord = await newRecord.save();

      // Populate the newly created record
      const populatedRecord = await SampleCollection.findById(
        savedRecord._id
>>>>>>> 7a35450 (asd)
      ).populate({
        path: "tests",
        populate: {
          path: "test",
        },
      });

      return res.json({
<<<<<<< HEAD
        message: "Patient record created successfully",
        updatedRecord,
      });
    } catch (error) {
=======
        message: "Record created successfully.",
        populatedRecord,
      });
    } catch (error) {
      console.error("Error in createThread:", error);
>>>>>>> 7a35450 (asd)
      return res.status(500).json({ error: error.message });
    }
  },

<<<<<<< HEAD
=======
  getByRegistrationId: async (req, res) => {
    try {
      const { registrationId } = req.params;
      const samples = await SampleCollection.find({ registrationId })
        .populate({
          path: "tests.test",
          model: "TestMaster",
        })
        .populate("patientId")
        .populate("registrationId");

      console.log("Samplecollection", samples[0]?.tests); // Log before sending the response
      res.json(samples);
    } catch (error) {
      if (!res.headersSent) {
        res.status(500).json({ error: error.message }); // Send error response only if headers are not sent
      } else {
        console.error("Error after response sent:", error); // Log error
      }
    }
  },

>>>>>>> 7a35450 (asd)
  getServices: async (req, res, next) => {
    try {
      const { userId, RegistrationId } = req.params;
      const usertobefound = new mongoose.Types.ObjectId(userId);
      console.log(usertobefound);

      const registration = await Registration.findById(RegistrationId);
      console.log("This is registration", registration);

      const servicePayable = await SampleCollection.find({
        userId: usertobefound,
<<<<<<< HEAD
      }).populate({
        path: "tests",
        populate: {
          path: "test",
        },
      });
=======
      })
        .populate({
          path: "tests",
          populate: {
            path: "test",
          },
        })
        .populate({
          path: "registrationId",
        });
>>>>>>> 7a35450 (asd)

      console.log("SampleCollection", servicePayable);
      return res.status(200).json(servicePayable);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },
  getServicesbyId: async (req, res, next) => {
    try {
      const patientId = req.params.referenceId;
      const services = await SampleCollection.findById(patientId)
        .populate({
          path: "associate",
        })
        .populate({
          path: "test",
        });
      return res.status(200).json(services);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },

  updateThreads: async (req, res, next) => {
    try {
      const patientId = req.params.associateId;
      const { associate, test, value, userId } = req.body;

      const newService = await SampleCollection.findByIdAndUpdate(
        patientId,
        {
          associate,
          test,
          value,
          userId,
        },
        { new: true }
      );
      if (!newService) {
        return res.status(404).json({ message: "Service not found." });
      }

      return res.json({ message: "Service updated successfully.", newService });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },
  deleteThread: async (req, res, next) => {
    try {
      const patientId = req.params.specimenId;
      const newService = await SampleCollection.findByIdAndDelete(patientId);
      if (!newService) {
        return res.status(404).json({ message: "Service not found." });
      }

      return res.json({ message: "Service deleted successfully.", newService });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },
  uploadCSV: async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      const results = [];
      fs.createReadStream(req.file.path)
        .pipe(csv())
        .on("data", (data) => results.push(data))
        .on("end", async () => {
          try {
            console.log("CSV data", results);

            const formattedData = await Promise.all(
              results.map(async (row) => {
                const associate = await Associate.findOne({
                  firstName: row.associate,
                }).exec();
                const test = await Test.findOne({ name: row.test }).exec();
                const userId = await User.findOne({
                  username: row.userId,
                }).exec();

                if (!associate || !test) {
                  // Skip rows with missing associate or test
                  return null;
                }

                const existingRecord = await SampleCollection.findOne({
                  associate: associate._id,
                  test: test._id,
                  userId: userId?._id,
                }).exec();

                if (existingRecord) {
                  // Update existing record
                  await SampleCollection.findOneAndUpdate(
                    {
                      associate: associate._id,
                      test: test._id,
                      userId: userId?._id,
                    },
                    {
                      value: row?.value,
                    }
                  );
                  return null; // Do not include this record for insertion
                } else {
                  // Prepare new record for insertion
                  return {
                    associate: associate._id,
                    test: test._id,
                    value: row?.value,
                    userId: userId?._id,
                  };
                }
              })
            );

            // Filter out null values
            const validData = formattedData.filter((item) => item !== null);

            if (validData.length > 0) {
              // Insert new records
              await SampleCollection.insertMany(validData);
            }

            // Clean up: delete the uploaded file
            fs.unlinkSync(req.file.path);

            return res.json({
              message: "CSV processed successfully",
              updated: results.length - validData.length, // Count of updated records
              inserted: validData.length, // Count of inserted records
            });
          } catch (error) {
            // Handle errors gracefully
            return res.status(500).json({ error: error.message });
          }
        });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },
  createSampleCollection: async (req, res) => {
    try {
      const registration = await Registration.findById(
        req.params.registrationId
      );
      if (!registration) {
        return res.status(404).json({ error: "Registration not found" });
      }

      // Create sample collection entry for each test in registration
      const sampleCollection = new SampleCollection({
        registrationId: registration._id,
        patientId: registration.patientId,
        tests: registration.tests.map((test) => ({
          test: test.tests,
<<<<<<< HEAD
          status: "pending",
=======
          status: "collected",
>>>>>>> 7a35450 (asd)
        })),
        userId: req.body.userId,
      });

      await sampleCollection.save();
      res.status(201).json(sampleCollection);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  getPendingSamples: async (req, res) => {
    try {
      const samples = await SampleCollection.find({
        "tests.status": "pending",
      })
        .populate("registrationId")
        .populate("patientId")
        .populate("tests.test");

      res.json(samples);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  collectSample: async (req, res) => {
    try {
      const { sampleId, testId } = req.params;
      const sample = await SampleCollection.findById(sampleId);

      if (!sample) {
        return res.status(404).json({ error: "Sample not found" });
      }
<<<<<<< HEAD
=======
      console.log("sample", JSON.stringify(sample));
>>>>>>> 7a35450 (asd)

      const testIndex = sample.tests.findIndex(
        (test) => test.test.toString() === testId
      );

      if (testIndex === -1) {
        return res.status(404).json({ error: "Test not found in sample" });
      }

      sample.tests[testIndex].status = "collected";
      sample.tests[testIndex].collectedAt = new Date();
      sample.tests[testIndex].collectedBy = req.body.userId;

      await sample.save();
      res.json(sample);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  handleRejectedSample: async (req, res) => {
    try {
      const { sampleId, testId } = req.params;
      const { rejectionReason } = req.body;

      const sample = await SampleCollection.findById(sampleId);
      if (!sample) {
        return res.status(404).json({ error: "Sample not found" });
      }

      const testIndex = sample.tests.findIndex(
        (test) => test.test.toString() === testId
      );

      if (testIndex === -1) {
        return res.status(404).json({ error: "Test not found in sample" });
      }

      sample.tests[testIndex].status = "rejected";
      sample.tests[testIndex].rejectionReason = rejectionReason;
      sample.tests[testIndex].collectedAt = null;
      sample.tests[testIndex].collectedBy = null;

      await sample.save();
      res.json(sample);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};
module.exports = SampleCollectionController;
