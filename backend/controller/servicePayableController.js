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
        const testtobefound = new mongoose.Types.ObjectId(test?.testId);
        const findexistingservice = await ServicePayable.find({
          associate: associatetobefound,
          "test.testId": testtobefound, // Matches any object in the array with this testId
          userId: Usertobefound,
        });

        console.log("Find existing", findexistingservice);

        if (findexistingservice && findexistingservice.length > 0) {
          console.log("Existing");
          test.date = new Date();
          const updatedService = await ServicePayable.findOneAndUpdate(
            { _id: findexistingservice[0]._id },
            { associate: item, department, test, value, userId },
            { new: true }
          );
          results.push(updatedService);
        } else {
          console.log("Non existing ");
          test.date = new Date();

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

      // Fetch associate details (assumes Associate model is imported)
      const associatesDetails = await Associate.find({
        _id: { $in: associates.map((id) => new mongoose.Types.ObjectId(id)) },
      });
      // Create a lookup map: associate id => associate details
      const associateDetailsMap = new Map(
        associatesDetails.map((detail) => [detail._id.toString(), detail])
      );

      // Fetch all relevant tests
      const tests = await Test.find({
        userId: new mongoose.Types.ObjectId(userId),
        ...(departmentId && {
          department: new mongoose.Types.ObjectId(departmentId),
        }),
      });

      // Create test map with all associates pre-populated with default values
      const testMap = new Map(
        tests.map((test) => [
          test._id.toString(),
          {
            testId: test,
            defaultPrice: test.price,
            defaultPercentage: test.percentage,
            // prices: Map of associateId => {price, percentage}
            prices: new Map(
              associates.map((associateId) => [
                associateId,
                { price: test.price, percentage: test.percentage },
              ])
            ),
          },
        ])
      );

      // Process ServicePayable for each associate to update prices
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

      // Update prices based on services for each associate
      allServices?.forEach((services, index) => {
        const associateId = associates[index];
        services?.forEach((service) => {
          service?.test?.forEach((serviceTest) => {
            const testId = serviceTest.testId?._id?.toString();
            if (!testId || !testMap.has(testId)) return;
            const testEntry = testMap.get(testId);
            const currentPrice = serviceTest.price ?? testEntry.defaultPrice;
            const currentPercentage =
              serviceTest.percentage ?? testEntry.defaultPercentage;
            console.log("currentprice", serviceTest);
            testEntry.date = serviceTest?.date;
            testEntry.prices.set(associateId, {
              price: currentPrice,
              percentage: currentPercentage,
            });
          });
        });
      });

      // Process each test to split associates into non-conflict and conflict arrays
      const results = Array.from(testMap.values()).map((testEntry) => {
        // Group values by "price-percentage" key
        const groupMap = {};
        testEntry.prices.forEach(({ price, percentage }, associateId) => {
          const key = `${price}-${percentage}`;
          if (!groupMap[key]) {
            groupMap[key] = { value: { price, percentage }, associates: [] };
          }
          groupMap[key].associates.push(associateId);
        });

        // Determine the unified value (most frequent group)
        let unifiedGroup = null;
        Object.keys(groupMap).forEach((key) => {
          const group = groupMap[key];
          if (
            !unifiedGroup ||
            group.associates.length > unifiedGroup.associates.length
          ) {
            unifiedGroup = group;
          }
        });

        // Split associates into non-conflict and conflict based on unified value
        const nonConflictAssociates = [];
        const conflictAssociates = [];
        testEntry.prices.forEach(({ price, percentage }, associateId) => {
          const meta = associateDetailsMap.get(associateId) || {
            _id: associateId,
          };
          console.log("PPPPPPPP", testEntry.testId);
          const associateData = {
            ...meta._doc,
            value: { price, percentage },
            testId: testEntry.testId,
          };

          if (price === unifiedGroup.value.price) {
            nonConflictAssociates.push(associateData);
          } else {
            conflictAssociates.push(associateData);
          }
        });

        return {
          testId: testEntry.testId,
          defaultPrice: testEntry.defaultPrice,
          defaultPercentage: testEntry.defaultPercentage,
          unifiedValue: unifiedGroup.value,
          date: testEntry.date,
          nonConflictAssociates,
          conflictAssociates,
          prices: Object.fromEntries(testEntry.prices),
          hasConflict: conflictAssociates.length > 0,
        };
      });

      res.status(200).json({
        associates,
        // Also send a full mapping of associate metadata if needed on the frontend
        associatesMeta: Object.fromEntries(
          associatesDetails.map((detail) => [detail._id.toString(), detail])
        ),
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
