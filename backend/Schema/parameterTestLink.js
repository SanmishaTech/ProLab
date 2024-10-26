// models/user.js
const mongoose = require("mongoose");

const parameterLinkSchema = new mongoose.Schema({
  test: { type: String },
  parameterGroup: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ParameterGroup",
  },
  parameter: { type: mongoose.Schema.Types.ObjectId, ref: "Parameter" },
});

const ParameterLink = mongoose.model("ParameterLink", parameterLinkSchema);
module.exports = ParameterLink;
