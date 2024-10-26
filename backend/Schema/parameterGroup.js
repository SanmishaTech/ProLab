// models/user.js
const mongoose = require("mongoose");

const parameterGroupSchema = new mongoose.Schema({
  description: { type: String },
  sort: { type: Number },
});

const ParameterGroup = mongoose.model("ParameterGroup", parameterGroupSchema);
module.exports = ParameterGroup;
