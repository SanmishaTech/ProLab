// Test script to verify history display in Tablecomponent

// Sample data structure matching what we expect from API
const sampleTest = {
  _id: "67ced71651af95c021e329fc",
  name: "Sample Test",
  testId: "67ced71651af95c021e329fc",
  currentPurchasePrice: 111,
  currentSaleRate: 111111,
  currentPercentage: 0,
  currentFromDate: "2025-03-17T09:31:46.007+00:00",
  currentToDate: null,
  history: [
    {
      purchasePrice: 11,
      saleRate: 11,
      percentage: 0,
      fromDate: "2025-03-17T09:29:10.064+00:00",
      toDate: "2025-03-17T09:31:46.007+00:00",
      _id: "67d7eb6635360b21b09d3e42",
    },
  ],
};

// Format the data for display to show how it will look
function formatTestForDisplay(test) {
  // Current values
  console.log("Current Test Data:");
  console.log(`Name: ${test.name}`);
  console.log(`Purchase Rate: ${test.currentPurchasePrice}`);
  console.log(`Sale Rate: ${test.currentSaleRate}`);
  console.log(
    `From Date: ${new Date(test.currentFromDate).toLocaleDateString("en-GB")}`
  );
  console.log(
    `To Date: ${
      test.currentToDate
        ? new Date(test.currentToDate).toLocaleDateString("en-GB")
        : "N/A"
    }`
  );

  // History
  console.log("\nHistory:");

  if (test.history && test.history.length > 0) {
    test.history.forEach((entry, index) => {
      console.log(`\nHistory Entry #${index + 1}:`);
      console.log(`Purchase Price: ${entry.purchasePrice}`);
      console.log(`Sale Rate: ${entry.saleRate}`);
      console.log(`Percentage: ${entry.percentage}%`);
      console.log(
        `From Date: ${new Date(entry.fromDate).toLocaleDateString("en-GB")}`
      );
      console.log(
        `To Date: ${
          entry.toDate
            ? new Date(entry.toDate).toLocaleDateString("en-GB")
            : "N/A"
        }`
      );
    });
  } else {
    console.log("No history available");
  }
}

// Print the formatted test data
formatTestForDisplay(sampleTest);

// This is what the data should look like after processing through Tablecomponent
console.log("\n\nAfter Processing in Tablecomponent:");

const processedTest = {
  ...sampleTest,
  purchaseRate: sampleTest.currentPurchasePrice,
  saleRate: sampleTest.currentSaleRate,
  date: new Date(sampleTest.currentFromDate).toLocaleDateString("en-GB"),
  originalPurchaseRate: sampleTest.currentPurchasePrice,
  originalSaleRate: sampleTest.currentSaleRate,
  history: [
    ...sampleTest.history.map((entry) => ({
      date: new Date(entry.fromDate).toLocaleDateString("en-GB"),
      purchaseRate: entry.purchasePrice,
      saleRate: entry.saleRate,
      reason: "Historical Rate",
      purchasePrice: entry.purchasePrice,
      percentage: entry.percentage,
      fromDate: entry.fromDate,
      toDate: entry.toDate,
      _id: entry._id,
    })),
    {
      date: new Date(sampleTest.currentFromDate).toLocaleDateString("en-GB"),
      purchaseRate: sampleTest.currentPurchasePrice,
      saleRate: sampleTest.currentSaleRate,
      reason: "Current Rate",
      purchasePrice: sampleTest.currentPurchasePrice,
      percentage: sampleTest.currentPercentage,
      fromDate: sampleTest.currentFromDate,
      toDate: sampleTest.currentToDate,
      _id: `initial_${sampleTest._id}`,
    },
  ],
};

// Print the processed test data to verify it looks correct
formatTestForDisplay(processedTest);

// To run this script, execute: node testHistoryDisplay.js
