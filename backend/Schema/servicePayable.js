const mongoose = require("mongoose");

// Define a schema for each test object that includes a reference and price
const testSchema = new mongoose.Schema({
  testId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "TestMaster",
  },
  price: { type: Number },
  percentage: { type: Number },
});

const servicePayable = new mongoose.Schema({
  associate: { type: mongoose.Schema.Types.ObjectId, ref: "AssociateMaster" },
  department: { type: mongoose.Schema.Types.ObjectId, ref: "DepartmentMaster" },
  // Use an array of objects containing testId and price
  test: [testSchema],
  value: { type: Number },
  percentage: { type: Number },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

const ServicePayable = mongoose.model("ServicePayable", servicePayable);
module.exports = ServicePayable;
