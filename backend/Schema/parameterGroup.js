// models/user.js
const mongoose = require("mongoose");

const parameterGroupSchema = new mongoose.Schema({
  description: { type: String },
  sort: { type: Number },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

const ParameterGroup = mongoose.model("ParameterGroup", parameterGroupSchema);
module.exports = ParameterGroup;
