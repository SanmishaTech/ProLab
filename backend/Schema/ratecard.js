const mongoose = require("mongoose");

// Define a schema for the history of a test change with dual pricing
const historySchema = new mongoose.Schema(
  {
    purchasePrice: { type: Number },
    saleRate: { type: Number },
    percentage: { type: Number },
    fromDate: { type: Date },
    toDate: { type: Date },
  },
  { _id: false }
);

// Define the test schema which now includes current dual pricing and a history array
const testSchema = new mongoose.Schema({
  testId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "TestMaster",
  },
  purchasePrice: { type: Number },
  saleRate: { type: Number },
  currentPercentage: { type: Number },
  currentFromDate: { type: Date },
  currentToDate: { type: Date },
  history: [historySchema],
});

// Define the ratecard schema that includes an array of test records
const rateCardSchema = new mongoose.Schema(
  {
    associate: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AssociateMaster",
      unique: true,
      required: true,
    },
    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "DepartmentMaster",
    },
    test: [testSchema],
    // Updated "value" to include both purchasePrice and saleRate.
    value: {
      purchasePrice: { type: Number },
      saleRate: { type: Number },
    },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { versionKey: false }
);

const Ratecard = mongoose.model("Ratecard", rateCardSchema);
module.exports = Ratecard;
