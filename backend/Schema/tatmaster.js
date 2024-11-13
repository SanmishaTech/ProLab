const mongoose = require("mongoose");

const tatmasterSchema = new mongoose.Schema({
  selectTest: { type: mongoose.Schema.Types.ObjectId, ref: "TestMaster" },
  startTime: { type: Date },
  endTime: { type: Date },
  hoursNeeded: { type: Number },
  urgentHours: { type: Number },
  monday: { type: Boolean, default: false },
  tuesday: { type: Boolean, default: false },
  wednesday: { type: Boolean, default: false },
  thursday: { type: Boolean, default: false },
  friday: { type: Boolean, default: false },
  saturday: { type: Boolean, default: false },
  sunday: { type: Boolean, default: false },
});

const TatMaster = mongoose.model("TatMaster", tatmasterSchema);

module.exports = TatMaster;
