const ServicePayable = require("../Schema/servicePayable");
const User = require("../Schema/userSchema");
const mongoose = require("mongoose");
const Test = require("../Schema/testMaster");
const Associate = require("../Schema/associatemaster");
const fs = require("fs");
const csv = require("csv-parser");

const ServicePayableController = {
  createThread: async (req, res, next) => {
    try {
      const { associate, test, value, userId } = req.body;
      const newService = new ServicePayable({
        associate,
        test,
        value,
        userId,
      });
      const newServics = await newService.save();

      res.json({
        message: "Patients created successfully",
        service: newServics,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  getServices: async (req, res, next) => {
    try {
      const userId = req.params.userId;
      const usertobefound = new mongoose.Types.ObjectId(userId);

      //   const patient = await ServicePayable.find({
      //     userId: usertobefound,
      //   });
      const servicePayable = await ServicePayable.find({
        userId: usertobefound,
      })
        .populate({
          path: "associate",
        })
        .populate({
          path: "test",
        });
      res.status(200).json(servicePayable);
    } catch (error) {
      res.status(500).json({ error: error.message });
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
      res.status(200).json(services);
    } catch (error) {
      res.status(500).json({ error: error.message });
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

      res.json({ message: "Service updated successfully.", newService });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  deleteThread: async (req, res, next) => {
    try {
      const patientId = req.params.specimenId;
      const newService = await ServicePayable.findByIdAndDelete(patientId);
      if (!newService) {
        return res.status(404).json({ message: "Service not found." });
      }

      res.json({ message: "Service deleted successfully.", newService });
    } catch (error) {
      res.status(500).json({ error: error.message });
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

            res.json({
              message: "CSV processed successfully",
              updated: results.length - validData.length, // Count of updated records
              inserted: validData.length, // Count of inserted records
            });
          } catch (error) {
            // Handle errors gracefully
            res.status(500).json({ error: error.message });
          }
        });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};
module.exports = ServicePayableController;
