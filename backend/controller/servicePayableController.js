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
      const { associate, department, test, value, userId } = req.body;
      const associatetobefound = new mongoose.Types.ObjectId(associate);
      const departmenttobefound = new mongoose.Types.ObjectId(department);
      const Usertobefound = new mongoose.Types.ObjectId(userId);
      // const testtobefound = mongoose.Types.ObjectId(test);

      const findexistingservice = await ServicePayable.find({
        associate: associatetobefound,

        userId: Usertobefound,
      });
      if (findexistingservice && findexistingservice.length > 0) {
        const updatetests = await ServicePayable.findOneAndUpdate(
          { _id: findexistingservice[0]._id }, // Use the first document's ID
          { associate, department, test, value, userId },
          { new: true } // Option to return the updated document
        );
        console.log(updatetests);
        return res.json({
          message: "Patients Updated successfully",
          service: updatetests,
        });
      }

      const newService = new ServicePayable({
        associate,
        department,
        test,
        value,
        userId,
      });
      // console.log(newService);
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

  getAssociates: async (req, res, next) => {
    try {
      const associates = req.body.associate; // Changed to array
      const userId = req.params.userId;
      const usertobefound = new mongoose.Types.ObjectId(userId);
      const departmentId = req.query.departmentId;
      const departmenttobefound = departmentId
        ? new mongoose.Types.ObjectId(departmentId)
        : null;

      // console.log(associates);
      // Process all associates

      const servicePromises = await associates?.map(async (associateId) => {
        const associateObjectId = new mongoose.Types.ObjectId(associateId);
        // console.log(associateObjectId);
        const services = await ServicePayable.find({
          associate: associateObjectId,
          userId: usertobefound,
        })
          .populate({
            path: "associate",
          })
          .populate({
            path: "test",
            populate: {
              path: "testId",
            },
          });
        // console.log(services);

        return services;
      });

      // console.log("Execute", servicePromises);
      const allServices = await Promise.all(servicePromises);
      console.log(allServices);

      // Get all tests once
      let tests = await Test.find({
        userId: usertobefound,
        ...(departmentId && { department: departmenttobefound }),
      });

      // Create test map with price conflicts
      const testMap = new Map();

      tests.forEach((test) => {
        const testEntry = {
          testId: test,
          defaultPrice: test.price,
          defaultPercentage: test.percentage,
          prices: new Map(), // Map of associate IDs to their prices
          hasConflict: false,
        };
        testMap.set(test._id.toString(), testEntry);
      });

      // Populate prices from services
      allServices.forEach((services, index) => {
        const associateId = associates[index];
        services.forEach((service) => {
          service.test.forEach((serviceTest) => {
            const testId = serviceTest.testId?._id?.toString();
            if (testId && testMap.has(testId)) {
              const testEntry = testMap.get(testId);
              const existingPrice = testEntry.prices.get(associateId);

              if (
                existingPrice &&
                (existingPrice !== serviceTest.price ||
                  existingPercentage !== serviceTest.percentage)
              ) {
                testEntry.hasConflict = true;
              }

              testEntry.prices.set(associateId, {
                price: serviceTest.price || testEntry.defaultPrice,
                percentage:
                  serviceTest.percentage || testEntry.defaultPercentage,
              });
            }
          });
        });
      });

      // Check for conflicts
      const results = Array.from(testMap.values())?.map((testEntry) => {
        const conflicts = [];
        let basePrice = null;
        let basePercentage = null;

        testEntry.prices.forEach((value, associateId) => {
          if (basePrice === null) {
            basePrice = value.price;
            basePercentage = value.percentage;
          } else if (
            value.price !== basePrice ||
            value.percentage !== basePercentage
          ) {
            conflicts.push(associateId);
            testEntry.hasConflict = true;
          }
        });

        return {
          ...testEntry,
          conflicts:
            conflicts.length > 0
              ? {
                  message: "Price/percentage conflict detected",
                  associates: conflicts,
                  basePrice,
                  basePercentage,
                }
              : null,
        };
      });

      res.status(200).json({
        associates,
        department: departmentId,
        tests: results,
        hasConflicts: results.some((test) => test.hasConflict),
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  updateThreads: async (req, res, next) => {
    try {
      const patientId = req.params.associateId;
      const { associate, department, test, value, userId } = req.body;

      const newService = await ServicePayable.findByIdAndUpdate(
        patientId,
        {
          associate,
          department,
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
};
module.exports = ServicePayableController;
