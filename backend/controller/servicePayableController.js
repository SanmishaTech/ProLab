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
      const Usertobefound = new mongoose.Types.ObjectId(userId);
      const results = [];

      for (const item of associate) {
        const associatetobefound = new mongoose.Types.ObjectId(item);
        console.log("Associate", associatetobefound);
        const findexistingservice = await ServicePayable.find({
          associate: associatetobefound,
          userId: Usertobefound,
        });
        console.log("Find existing", findexistingservice);

        if (findexistingservice && findexistingservice.length > 0) {
          console.log("Existing");
          const updatedService = await ServicePayable.findOneAndUpdate(
            { _id: findexistingservice[0]._id },
            { associate: item, department, test, value, userId },
            { new: true }
          );
          results.push(updatedService);
        } else {
          console.log("Non existing ");
          const newService = new ServicePayable({
            associate: item,
            department,
            test,
            value,
            userId,
          });
          const new_SR = await newService.save();
          results.push(new_SR);
        }
      }

      // Send a single response with the aggregated results
      return res.status(200).json(results);
    } catch (error) {
      return res.status(500).json({ error: error.message });
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
      const associates = req.body.associate;
      const userId = req.params.userId;
      const departmentId = req.query.departmentId;

      // Fetch all relevant tests first
      const tests = await Test.find({
        userId: new mongoose.Types.ObjectId(userId),
        ...(departmentId && {
          department: new mongoose.Types.ObjectId(departmentId),
        }),
      });

      // Create test map with all associates pre-populated
      const testMap = new Map(
        tests.map((test) => [
          test._id.toString(),
          {
            testId: test,
            defaultPrice: test.price,
            defaultPercentage: test.percentage,
            prices: new Map(
              associates.map((associateId) => [
                associateId,
                {
                  price: test.price, // Default price
                  percentage: test.percentage, // Default percentage
                },
              ])
            ),
            hasConflict: false,
          },
        ])
      );

      // Process services for all associates
      const servicePromises = associates.map(async (associateId) => {
        return ServicePayable.find({
          associate: new mongoose.Types.ObjectId(associateId),
          userId: new mongoose.Types.ObjectId(userId),
        }).populate({
          path: "test",
          populate: { path: "testId" },
        });
      });

      const allServices = await Promise.all(servicePromises);

      // Update prices from services
      allServices.forEach((services, index) => {
        const associateId = associates[index];
        services.forEach((service) => {
          service.test.forEach((serviceTest) => {
            const testId = serviceTest.testId?._id?.toString();
            if (!testId || !testMap.has(testId)) return;

            const testEntry = testMap.get(testId);
            const currentPrice = serviceTest.price ?? testEntry.defaultPrice;
            const currentPercentage =
              serviceTest.percentage ?? testEntry.defaultPercentage;

            testEntry.prices.set(associateId, {
              price: currentPrice,
              percentage: currentPercentage,
            });
          });
        });
      });

      // Detect conflicts
      const results = Array.from(testMap.values()).map((testEntry) => {
        let basePrice = null;
        let basePercentage = null;
        const conflictAssociates = new Set();

        testEntry.prices.forEach(({ price, percentage }, associateId) => {
          if (basePrice === null) {
            basePrice = price;
            basePercentage = percentage;
            // console.log(price, percentage);
          } else if (price !== basePrice || percentage !== basePercentage) {
            // conflictAssociates.add(associateId);
            // Add previous associates to conflicts too
            console.log(associateId);
            testEntry.prices.forEach((_, key) => {
              if (key !== associateId) conflictAssociates.add(key);
            });
          }
        });
        console.log();
        return {
          ...testEntry,
          prices: Object.fromEntries(testEntry.prices),
          hasConflict: conflictAssociates.size > 0,
          conflicts:
            conflictAssociates.size > 0
              ? {
                  message: "Price/percentage discrepancy",
                  associates: Array.from(conflictAssociates),
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
