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
                  reason: "Rate Update",
                  associate: item,
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
            purchaseRate: test.currentPurchasePrice,
            saleRate: test.currentSaleRate,
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
          purchaseRate: test.currentPurchasePrice,
          saleRate: test.currentSaleRate,
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

      // Update prices based on services for each associate
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
                  purchaseRate: entry.purchasePrice,
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
                };
              }
            );

            testEntry.history = processedHistory;
            testEntry.date = serviceTest.currentFromDate;

            testEntry.prices.set(associateId, {
              purchasePrice: currentPurchasePrice,
              saleRate: currentSaleRate,
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
            testRecord.currentPurchasePrice !== testItem.purchasePrice ||
            testRecord.currentSaleRate !== testItem.saleRate
          ) {
            // Archive current values to history
            testRecord.history.push({
              purchasePrice: testRecord.currentPurchasePrice,
              saleRate: testRecord.currentSaleRate,
              percentage: testRecord.currentPercentage,
              fromDate: testRecord.currentFromDate,
              toDate: now,
              reason: "Rate Update",
              associate: testItem.associate,
            });

            // Update with new values
            testRecord.currentPurchasePrice = testItem.purchasePrice;
            testRecord.currentSaleRate = testItem.saleRate;
            testRecord.currentPercentage = testItem.percentage;
            testRecord.currentFromDate = now;
            testRecord.currentToDate = null;
          }
        } else {
          // Add new test to rate card
          existingRateCard.test.push({
            testId,
            currentPurchasePrice: testItem.purchasePrice,
            currentSaleRate: testItem.saleRate,
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
