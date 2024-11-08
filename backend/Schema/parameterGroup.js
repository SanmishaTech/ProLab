// models/user.js
const mongoose = require("mongoose");

const parameterGroupSchema = new mongoose.Schema({
  name: { type: String },
  description: { type: String },
  adn: { type: String },
});

const ParameterGroup = mongoose.model("ParameterGroup", parameterGroupSchema);
module.exports = ParameterGroup;
