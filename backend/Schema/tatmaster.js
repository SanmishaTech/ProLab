const mongoose = require("mongoose");

const tatmasterSchema = new mongoose.Schema({
  selectTest: { type: mongoose.Schema.Types.ObjectId, ref: "TestMaster" },
  startTime: { type: String },
  endTime: { type: String },
  hoursNeeded: { type: Number },
  urgentHours: { type: Number },
  weekday: [
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
    "sunday",
  ],
});

const TatMaster = mongoose.model("TatMaster", tatmasterSchema);
module.exports = TatMaster;
