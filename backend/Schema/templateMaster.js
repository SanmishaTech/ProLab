// models/holiday.js

const mongoose = require("mongoose");

const templateSchema = new mongoose.Schema({
  template: { type: String },
  // Here, data is defined as an array of objects.
  data: { type: [mongoose.Schema.Types.Mixed] },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

const TemplateMaster = mongoose.model("TemplateMaster", templateSchema);
module.exports = TemplateMaster;
