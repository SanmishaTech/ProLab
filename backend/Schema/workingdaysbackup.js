// models/user.js
const mongoose = require("mongoose");

const workingdaysschema = new mongoose.Schema({
  breakFrom: { type: String },
  breakTo: { type: String },
  timeFrom: { type: String },
  timeTo: { type: String },
  day: { type: String },
  nonWorkingDay: { type: Boolean },

  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

const Workingdays = mongoose.model("WorkingDays", workingdaysschema);
module.exports = Workingdays;
