// models/user.js
const mongoose = require("mongoose");

const parameterSchema = new mongoose.Schema({
  name: { type: String },
  unit: { type: String },
  fieldType: { type: String },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

const Parameter = mongoose.model("Parameter", parameterSchema);
module.exports = Parameter;
