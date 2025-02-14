// models/corporatemaster.js

const mongoose = require("mongoose");

const servicePayable = new mongoose.Schema({
  associate: { type: mongoose.Schema.Types.ObjectId, ref: "AssociateMaster" },
  department: { type: mongoose.Schema.Types.ObjectId, ref: "DepartmentMaster" },
  test: { type: mongoose.Schema.Types.ObjectId, ref: "TestMaster" },
  value: { type: Number },
  percentage: { type: Number },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

const ServicePayable = mongoose.model("ServicePayable", servicePayable);
module.exports = ServicePayable;
