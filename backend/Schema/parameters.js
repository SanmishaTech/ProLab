// models/user.js
const mongoose = require("mongoose");

const parameterSchema = new mongoose.Schema({
  name: { type: String },
  unit: { type: String },
  fieldType: { type: String },
});

const Parameter = mongoose.model("Parameter", parameterSchema);
module.exports = Parameter;
