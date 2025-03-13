const ServicePayable = require("../Schema/ratecard");
const User = require("../Schema/userSchema");
const mongoose = require("mongoose");
const Test = require("../Schema/testMaster");
const Associate = require("../Schema/associatemaster");
const fs = require("fs");
const csv = require("csv-parser");

const RatecardController = {
  createThread: async (req, res, next) => {
    try {
      const { associate, department, test, value, userId } = req.body;
      const userObjectId = new mongoose.Types.ObjectId(userId);
      const now = new Date();
      const results = [];

      // Loop through each associate in the request
      for (const item of associate) {
        const associateObjectId = new mongoose.Types.ObjectId(item);
        const testObjectId = new mongoose.Types.ObjectId(test?.testId);

        // Look for an existing ServicePayable document for this associate and user
        let ratecardDoc = await ServicePayable.findOne({
          associate: associateObjectId,
          userId: userObjectId,
        });

        if (ratecardDoc) {
          // Find the existing test record for this testId
          let testRecord = ratecardDoc.test.find((t) =>
            t.testId.equals(testObjectId)
          );

          if (testRecord) {
            // If both purchasePrice and saleRate are unchanged, skip any update.
            if (
              testRecord.currentPurchasePrice === test.purchasePrice &&
              testRecord.currentSaleRate === test.saleRate
            ) {
              console.log("Prices unchanged for associate:", associateObjectId);
              results.push(ratecardDoc);
              continue;
            }
            // Archive the current state if active, but only if the last archived values differ.
            if (!testRecord.currentToDate) {
              const lastHistory =
                testRecord.history[testRecord.history.length - 1];
              if (
                !lastHistory ||
                lastHistory.purchasePrice !== test.purchasePrice ||
                lastHistory.saleRate !== test.saleRate
              ) {
                testRecord.history.push({
                  purchasePrice: testRecord.currentPurchasePrice,
                  saleRate: testRecord.currentSaleRate,
                  percentage: testRecord.currentPercentage,
                  fromDate: testRecord.currentFromDate,
                  toDate: now,
                });
              }
            }
            // Update the current test state with the new data.
            testRecord.currentPurchasePrice = test.purchasePrice;
            testRecord.currentSaleRate = test.saleRate;
            testRecord.currentPercentage = test.percentage;
            testRecord.currentFromDate = now;
            testRecord.currentToDate = null;
          } else {
            // Test record not found; add a new one.
            const newTestRecord = {
              testId: testObjectId,
              currentPurchasePrice: test.purchasePrice,
              currentSaleRate: test.saleRate,
              currentPercentage: test.percentage,
              currentFromDate: now,
              currentToDate: null,
              history: [],
            };
            ratecardDoc.test.push(newTestRecord);
          }
          // Update other top-level fields as needed.
          ratecardDoc.department = department;
          ratecardDoc.value = {
            purchasePrice: test.purchasePrice,
            saleRate: test.saleRate,
          };
          console.log("Ratecard", ratecardDoc);
          await ratecardDoc.save({ validateBeforeSave: false });
        } else {
          // No ServicePayable document exists; create one with the new test record.
          const newTestRecord = {
            testId: testObjectId,
            currentPurchasePrice: test.purchasePrice,
            currentSaleRate: test.saleRate,
            currentPercentage: test.percentage,
            currentFromDate: now,
            currentToDate: null,
            history: [],
          };

          ratecardDoc = new ServicePayable({
            associate: associateObjectId,
            department,
            test: [newTestRecord],
            value: {
              purchasePrice: test.purchasePrice,
              saleRate: test.saleRate,
            },
            userId: userObjectId,
          });
          await ratecardDoc.save({ validateBeforeSave: false });
        }
        results.push(ratecardDoc);
      }

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

      // Fetch all relevant tests (assuming Test model now includes purchasePrice and saleRate)
      const tests = await Test.find({
        userId: new mongoose.Types.ObjectId(userId),
        ...(departmentId && {
          department: new mongoose.Types.ObjectId(departmentId),
        }),
      });

      // Create test map with all associates pre-populated with default dual pricing values
      const testMap = new Map(
        tests.map((test) => [
          test._id.toString(),
          {
            testId: test,
            defaultPurchasePrice: test.purchasePrice,
            defaultSaleRate: test.saleRate,
            defaultPercentage: test.percentage,
            // prices: Map of associateId => { purchasePrice, saleRate, percentage }
            prices: new Map(
              associates.map((associateId) => [
                associateId,
                {
                  purchasePrice: test.purchasePrice,
                  saleRate: test.saleRate,
                  percentage: test.percentage,
                },
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

      // Update prices based on ServicePayable for each associate
      allServices?.forEach((services, index) => {
        const associateId = associates[index];
        services?.forEach((service) => {
          service?.test?.forEach((serviceTest) => {
            const testId = serviceTest.testId?._id?.toString();
            if (!testId || !testMap.has(testId)) return;
            const testEntry = testMap.get(testId);

            const currentPurchasePrice =
              serviceTest.currentPurchasePrice ??
              testEntry.defaultPurchasePrice;
            const currentSaleRate =
              serviceTest.currentSaleRate ?? testEntry.defaultSaleRate;
            const currentPercentage =
              serviceTest.currentPercentage ?? testEntry.defaultPercentage;
            testEntry.prices.set(associateId, {
              purchasePrice: currentPurchasePrice,
              saleRate: currentSaleRate,
              percentage: currentPercentage,
            });
          });
        });
      });

      // Process each test to split associates into non-conflict and conflict arrays
      const results = Array.from(testMap.values()).map((testEntry) => {
        // Group values by a combined key: "purchasePrice-saleRate-percentage"
        const groupMap = {};
        testEntry.prices.forEach(
          ({ purchasePrice, saleRate, percentage }, associateId) => {
            const key = `${purchasePrice}-${saleRate}-${percentage}`;
            if (!groupMap[key]) {
              groupMap[key] = {
                value: { purchasePrice, saleRate, percentage },
                associates: [],
              };
            }
            groupMap[key].associates.push(associateId);
          }
        );

        // Determine the unified value (the most frequent group)
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

        // Split associates into non-conflict and conflict based on the unified value
        const nonConflictAssociates = [];
        const conflictAssociates = [];
        testEntry.prices.forEach(
          ({ purchasePrice, saleRate, percentage }, associateId) => {
            const meta = associateDetailsMap.get(associateId) || {
              _id: associateId,
            };
            const associateData = {
              ...meta._doc, // Use _doc if using Mongoose; adjust otherwise
              value: { purchasePrice, saleRate, percentage },
              testId: testEntry.testId,
            };

            if (
              purchasePrice === unifiedGroup.value.purchasePrice &&
              saleRate === unifiedGroup.value.saleRate &&
              percentage === unifiedGroup.value.percentage
            ) {
              nonConflictAssociates.push(associateData);
            } else {
              conflictAssociates.push(associateData);
            }
          }
        );

        return {
          testId: testEntry.testId,
          defaultPurchasePrice: testEntry.defaultPurchasePrice,
          defaultSaleRate: testEntry.defaultSaleRate,
          defaultPercentage: testEntry.defaultPercentage,
          unifiedValue: unifiedGroup.value,
          nonConflictAssociates,
          conflictAssociates,
          // For reference, include the raw prices mapping
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
module.exports = RatecardController;
