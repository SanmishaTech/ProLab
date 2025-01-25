const ServicePayable = require("../Schema/samplecollectionmaster");
const User = require("../Schema/userSchema");
const mongoose = require("mongoose");
const Test = require("../Schema/testMaster");
const Associate = require("../Schema/associatemaster");
const fs = require("fs");
const csv = require("csv-parser");
const SampleCollection = require("../Schema/samplecollectionmaster");
const Registration = require("../Schema/registration");

const ServicePayableController = {
  createThread: async (req, res, next) => {
    try {
      const { Registration, Tests, userId } = req.body;
      const registrationtobefound = new mongoose.Types.ObjectId(Registration);

      const findExistingrecords = await ServicePayable.findOne({
        Registration: registrationtobefound,
      });

      if (findExistingrecords) {
        const existingTests = findExistingrecords.Tests || [];

        // Merge unique tests if `Tests` is provided and not empty

        //lets make sur tests are unique
        const newTests = Tests.filter(
          (test) => !existingTests.includes(test) // Filter out duplicates
        );
        updatedTests = [...existingTests, ...newTests];
        // let updatedTests = existingTests;
        // if (Array.isArray(Tests) && Tests.length > 0) {
        //   const newTests = Tests.filter(
        //     (test) => !existingTests.includes(test) // Filter out duplicates
        //   );
        //   updatedTests = [...existingTests, ...newTests];
        // }

        const updateData = {
          Registration,
          userId,
        };

        if (updatedTests !== existingTests) {
          updateData.Tests = updatedTests; // Only update Tests if there are changes
        }

        const updateRecord = await ServicePayable.findByIdAndUpdate(
          findExistingrecords._id,
          updateData,
          { new: true }
        );

        if (!updateRecord) {
          return res.status(404).json({ message: "Service not found." });
        }
        //populate the new service
        const updatedRecond = await ServicePayable.findById(
          updateRecord._id
        ).populate({
          path: "Tests",
          populate: {
            path: "Tests",
          },
        });

        return res.json({
          message: "Service updated successfully.",
          updatedRecord: updatedRecond,
        });
      }

      // Create a new record if none exists
      const newService = new ServicePayable({
        Registration,
        Tests,
        userId,
      });
      const newServics = await newService.save();

      //populate the new service
      const updatedRecond = await ServicePayable.findById(
        newServics._id
      ).populate({
        path: "Tests",
        populate: {
          path: "Tests",
        },
      });

      return res.json({
        message: "Patient record created successfully",
        updatedRecord: updatedRecond,
      });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },

  getServices: async (req, res, next) => {
    try {
      const { userId, Registration } = req.params;
      const usertobefound = new mongoose.Types.ObjectId(userId);
      console.log(usertobefound);

      const servicePayable = await ServicePayable.find({
        userId: usertobefound,
      })
        .populate("Registration")
        .populate({
          path: "Tests",
          populate: {
            path: "Tests",
          },
        });
      console.log("servicePayable", servicePayable);
      return res.status(200).json(servicePayable);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },
  getServicesbyId: async (req, res, next) => {
    try {
      const patientId = req.params.referenceId;
      const services = await ServicePayable.findById(patientId)
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

      const newService = await ServicePayable.findByIdAndUpdate(
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
      const newService = await ServicePayable.findByIdAndDelete(patientId);
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

                const existingRecord = await ServicePayable.findOne({
                  associate: associate._id,
                  test: test._id,
                  userId: userId?._id,
                }).exec();

                if (existingRecord) {
                  // Update existing record
                  await ServicePayable.findOneAndUpdate(
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
              await ServicePayable.insertMany(validData);
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
      const registration = await Registration.findById(req.params.registrationId);
      if (!registration) {
        return res.status(404).json({ error: "Registration not found" });
      }

      // Create sample collection entry for each test in registration
      const sampleCollection = new SampleCollection({
        registrationId: registration._id,
        patientId: registration.patientId,
        tests: registration.tests.map(test => ({
          test: test.tests,
          status: "pending"
        })),
        userId: req.body.userId
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
        "tests.status": "pending"
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

      const testIndex = sample.tests.findIndex(
        test => test.test.toString() === testId
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
        test => test.test.toString() === testId
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
module.exports = ServicePayableController;
