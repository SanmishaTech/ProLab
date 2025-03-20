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
      const { associate, department, test, userId } = req.body;
      const userObjectId = new mongoose.Types.ObjectId(userId);
      const now = new Date();
      const results = [];

      // Filter duplicate associates if any
      const uniqueAssociates = [...new Set(associate)];

      // Process each unique associate
      for (const associateId of uniqueAssociates) {
        const associateObjectId = new mongoose.Types.ObjectId(associateId);
        const testObjectId = new mongoose.Types.ObjectId(test?.testId);

        // Retrieve existing document for the associate and user
        let ratecardDoc = await ServicePayable.findOne({
          associate: associateObjectId,
          userId: userObjectId,
        });

        if (!ratecardDoc) {
          // Create a new document if it doesn't exist
          ratecardDoc = new ServicePayable({
            associate: associateObjectId,
            userId: userObjectId,
            department,
            test: [
              {
                testId: testObjectId,
                purchasePrice: test.purchasePrice,
                saleRate: test.saleRate,
                currentPercentage: test.percentage,
                currentFromDate: now,
                currentToDate: null,
                history: [],
              },
            ],
            value: {
              purchasePrice: test.purchasePrice,
              saleRate: test.saleRate,
            },
          });
        } else {
          // Update top-level fields
          ratecardDoc.department = department;
          ratecardDoc.value = {
            purchasePrice: test.purchasePrice,
            saleRate: test.saleRate,
          };

          // Find the existing test record if it exists
          const existingTest = ratecardDoc.test.find((t) =>
            t.testId.equals(testObjectId)
          );
          console.log("LLLLL", existingTest);

          if (existingTest) {
            // Check if pricing has changed
            if (
              existingTest.purchasePrice !== test.purchasePrice ||
              existingTest.saleRate !== test.saleRate
            ) {
              if (!existingTest.currentToDate) {
                const lastHistory =
                  existingTest.history[existingTest.history.length - 1];
                if (
                  !lastHistory ||
                  lastHistory.purchasePrice !== test.purchasePrice ||
                  lastHistory.saleRate !== test.saleRate
                ) {
                  // Add history record for rate update
                  existingTest.history.push({
                    purchasePrice: existingTest.purchasePrice,
                    saleRate: existingTest.saleRate,
                    percentage: existingTest.currentPercentage,
                    fromDate: existingTest.currentFromDate,
                    toDate: now,
                  });
                }
              }
            }
            // Update the existing test record with new values
            existingTest.purchasePrice = test.purchasePrice;
            existingTest.saleRate = test.saleRate;
            existingTest.currentPercentage = test.percentage;
            existingTest.currentFromDate = now;
            existingTest.currentToDate = null;
          } else {
            // Add a new test record if one doesn't exist
            ratecardDoc.test.push({
              testId: testObjectId,
              purchasePrice: test.purchasePrice,
              saleRate: test.saleRate,
              currentPercentage: test.percentage,
              currentFromDate: now,
              currentToDate: null,
              history: [],
            });
          }
        }

        await ratecardDoc.save({ validateBeforeSave: false });
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

      const rateCards = await ServicePayable.find({
        userId: usertobefound,
      })
        .populate({
          path: "associate",
        })
        .populate({
          path: "test.testId",
        });

      // Transform data to include history
      const formattedRateCards = rateCards.map((card) => {
        return {
          ...card.toObject(),
          test: card.test.map((test) => ({
            ...test.toObject(),
            purchasePrice: test.purchasePrice,
            saleRate: test.saleRate,
            percentage: test.currentPercentage,
            date: test.currentFromDate,
            history: test.history,
          })),
        };
      });

      res.status(200).json(formattedRateCards);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  getServicesbyId: async (req, res, next) => {
    try {
      const rateCardId = req.params.referenceId;
      const rateCard = await ServicePayable.findById(rateCardId)
        .populate({
          path: "associate",
        })
        .populate({
          path: "test.testId",
        });

      if (!rateCard) {
        return res.status(404).json({ message: "Rate card not found." });
      }

      // Transform data to include history
      const formattedRateCard = {
        ...rateCard.toObject(),
        test: rateCard.test.map((test) => ({
          ...test.toObject(),
          purchasePrice: test.purchasePrice,
          saleRate: test.saleRate,
          percentage: test.currentPercentage,
          date: test.currentFromDate,
          history: test.history,
        })),
      };

      res.status(200).json(formattedRateCard);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  getAssociates: async (req, res, next) => {
    try {
      const associates = req.body.associate;
      const userId = req.params.userId;
      const departmentId = req.query.departmentId;

      // Fetch associate details
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

      // Create test map with all associates pre-populated with default dual pricing values
      const testMap = new Map(
        tests.map((test) => [
          test._id.toString(),
          {
            testId: test,
            defaultPurchasePrice: test.purchasePrice,
            defaultSaleRate: test.saleRate,
            defaultPercentage: test.percentage,
            // prices: Map of associateId => { purchasePrice, saleRate, percentage }s
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
            // new field to store history metadata per associate
            historyByAssociate: {},
            // Optionally, you may want to keep a combined history too (unchanged)
            history: [],
          },
        ])
      );

      // Process ServicePayable for each associate to update prices and accumulate history metadata
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

      // Update prices based on services for each associate and accumulate history by associate
      allServices?.forEach((services, index) => {
        const associateId = associates[index];
        const associate = associatesDetails.find(
          (associate) => associate._id.toString() === associateId.toString()
        );

        services?.forEach((service) => {
          console.log("MAOAOAOAOAOA", service);
          service?.test?.forEach((serviceTest) => {
            const testId = serviceTest.testId?._id?.toString();
            if (!testId || !testMap.has(testId)) return;
            const testEntry = testMap.get(testId);

            const purchasePrice =
              serviceTest.purchasePrice ?? testEntry.defaultPurchasePrice;
            const saleRate = serviceTest.saleRate ?? testEntry.defaultSaleRate;
            const currentPercentage =
              serviceTest.currentPercentage ?? testEntry.defaultPercentage;

            // Process history entries to include percentage change calculations
            const processedHistory = (serviceTest.history || []).map(
              (entry, index, arr) => {
                // Find previous entry to calculate changes
                const prevEntry =
                  index < arr.length - 1 ? arr[index + 1] : null;
                const previousPurchaseRate = prevEntry
                  ? prevEntry.purchasePrice
                  : testEntry.defaultPurchasePrice;
                const previousSaleRate = prevEntry
                  ? prevEntry.saleRate
                  : testEntry.defaultSaleRate;

                // Calculate absolute changes
                const purchaseRateChange =
                  entry.purchasePrice - previousPurchaseRate;
                const saleRateChange = entry.saleRate - previousSaleRate;

                // Calculate percentage changes (avoid division by zero)
                const purchasePercentageChange =
                  previousPurchaseRate !== 0
                    ? (purchaseRateChange / previousPurchaseRate) * 100
                    : entry.purchasePrice > 0
                    ? 100
                    : 0;

                const salePercentageChange =
                  previousSaleRate !== 0
                    ? (saleRateChange / previousSaleRate) * 100
                    : entry.saleRate > 0
                    ? 100
                    : 0;

                return {
                  date: entry.fromDate
                    ? new Date(entry.fromDate).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "2-digit",
                      })
                    : "",
                  purchasePrice: entry.purchasePrice,
                  saleRate: entry.saleRate,
                  previousPurchaseRate,
                  previousSaleRate,
                  purchaseRateChange,
                  saleRateChange,
                  purchasePercentageChange,
                  salePercentageChange,
                  reason: entry.reason || "Historical Rate",
                  fromDate: entry.fromDate,
                  toDate: entry.toDate,
                  _id:
                    entry._id ||
                    `history_${Date.now()}_${Math.random()
                      .toString(36)
                      .substring(2, 9)}`,
                  // Added metadata: associate id that produced this history entry
                  associate,
                };
              }
            );

            // Save the processed history by associate (without altering the original history field)
            if (!testEntry.historyByAssociate[associateId]) {
              testEntry.historyByAssociate[associateId] = [];
            }
            testEntry.historyByAssociate[associateId] =
              testEntry.historyByAssociate[associateId].concat(
                processedHistory
              );

            // You can choose to merge into a combined history if needed:
            // testEntry.history = testEntry.history.concat(processedHistory);

            // Set the test date (this remains as before)
            testEntry.date = serviceTest.currentFromDate;

            // Update the pricing for this associate
            testEntry.prices.set(associateId, {
              purchasePrice: purchasePrice,
              saleRate: saleRate,
              percentage: currentPercentage,
            });
          });
        });
      });

      const results = Array.from(testMap.values()).map((testEntry) => {
        // Group values by combined purchasePrice-saleRate key
        const priceGroups = new Map();
        let priceGroupCounts = new Map();

        // Iterate through all price entries for this test
        Array.from(testEntry.prices.entries()).forEach(
          ([associateId, priceData]) => {
            const priceKey = `${priceData.purchasePrice}-${priceData.saleRate}`;
            if (!priceGroups.has(priceKey)) {
              priceGroups.set(priceKey, {
                value: priceData,
                associates: [],
              });
              priceGroupCounts.set(priceKey, 0);
            }
            priceGroups.get(priceKey).associates.push(associateId);
            priceGroupCounts.set(priceKey, priceGroupCounts.get(priceKey) + 1);
          }
        );

        // Find the most common price group (or first if tied)
        let mostCommonPriceKey = "";
        let maxCount = 0;
        for (const [priceKey, count] of priceGroupCounts.entries()) {
          if (count > maxCount) {
            maxCount = count;
            mostCommonPriceKey = priceKey;
          }
        }

        // Get the unified group and separate conflicting/non-conflicting associates
        const unifiedGroup = priceGroups.get(mostCommonPriceKey) || {
          value: {
            purchasePrice: testEntry.defaultPurchasePrice,
            saleRate: testEntry.defaultSaleRate,
            percentage: testEntry.defaultPercentage,
          },
          associates: [],
        };

        // Separate associates into conflicting and non-conflicting
        const nonConflictAssociates = unifiedGroup.associates.map(
          (associateId) => {
            const associate = associateDetailsMap.get(associateId);
            return {
              _id: associateId,
              firstName: associate?.firstName,
              lastName: associate?.lastName,
              fullName: `${associate?.firstName || ""} ${
                associate?.lastName || ""
              }`.trim(),
              value: testEntry.prices.get(associateId),
              testId: testEntry.testId,
            };
          }
        );

        const conflictAssociates = Array.from(testEntry.prices.entries())
          .filter(
            ([associateId, priceData]) =>
              !unifiedGroup.associates.includes(associateId)
          )
          .map(([associateId, priceData]) => {
            const associate = associateDetailsMap.get(associateId);
            return {
              _id: associateId,
              firstName: associate?.firstName,
              lastName: associate?.lastName,
              fullName: `${associate?.firstName || ""} ${
                associate?.lastName || ""
              }`.trim(),
              value: priceData,
              testId: testEntry.testId,
            };
          });

        return {
          testId: testEntry.testId,
          defaultPurchasePrice: testEntry.defaultPurchasePrice,
          defaultSaleRate: testEntry.defaultSaleRate,
          defaultPercentage: testEntry.defaultPercentage,
          unifiedValue: unifiedGroup.value,
          date: testEntry.date,
          history: testEntry.history,
          // New metadata: history grouped by associate
          historyByAssociate: testEntry.historyByAssociate,
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
      const associateId = req.params.associateId;
      const { associate, department, test, value, userId } = req.body;
      const now = new Date();

      // Find existing rate card for this associate
      const existingRateCard = await ServicePayable.findOne({
        associate: new mongoose.Types.ObjectId(associateId),
        userId: new mongoose.Types.ObjectId(userId),
      });

      if (!existingRateCard) {
        return res.status(404).json({ message: "Rate card not found." });
      }

      // Process each test to update
      for (const testItem of test) {
        const testId = new mongoose.Types.ObjectId(testItem.testId);

        // Find the test in the rate card
        const testRecord = existingRateCard.test.find((t) =>
          t.testId.equals(testId)
        );

        if (testRecord) {
          // Only update if values have changed
          if (
            testRecord.purchasePrice !== testItem.purchasePrice ||
            testRecord.saleRate !== testItem.saleRate
          ) {
            // Archive current values to history
            testRecord.history.push({
              purchasePrice: testRecord.purchasePrice,
              saleRate: testRecord.saleRate,
              percentage: testRecord.currentPercentage,
              fromDate: testRecord.currentFromDate,
              toDate: now,
              reason: "Rate Update",
              associate: testItem.associate,
            });

            // Update with new values
            testRecord.purchasePrice = testItem.purchasePrice;
            testRecord.saleRate = testItem.saleRate;
            testRecord.currentPercentage = testItem.percentage;
            testRecord.currentFromDate = now;
            testRecord.currentToDate = null;
          }
        } else {
          // Add new test to rate card
          existingRateCard.test.push({
            testId,
            purchasePrice: testItem.purchasePrice,
            saleRate: testItem.saleRate,
            currentPercentage: testItem.percentage,
            currentFromDate: now,
            currentToDate: null,
            history: [],
          });
        }
      }

      // Save updated rate card
      const updatedRateCard = await existingRateCard.save();

      res.json({
        message: "Rate card updated successfully.",
        rateCard: updatedRateCard,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  deleteThread: async (req, res, next) => {
    try {
      const rateCardId = req.params.specimenId;
      const deletedRateCard = await ServicePayable.findByIdAndDelete(
        rateCardId
      );

      if (!deletedRateCard) {
        return res.status(404).json({ message: "Rate card not found." });
      }

      res.json({
        message: "Rate card deleted successfully.",
        deletedRateCard,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};
module.exports = RatecardController;
