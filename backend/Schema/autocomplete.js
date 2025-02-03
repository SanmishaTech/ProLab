// models/Autocomplete.js

const mongoose = require("mongoose");

const autoComplete = new mongoose.Schema({
  parameterId: { type: mongoose.Schema.Types.ObjectId, ref: "Parameter" },
  defaultValue: { type: Boolean },
  abnormal: { type: Boolean },
  message: { type: String },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

const AutoComplete = mongoose.model("Autocomplete", autoComplete);
module.exports = AutoComplete;
