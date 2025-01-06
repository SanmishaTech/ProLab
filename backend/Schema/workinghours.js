const mongoose = require("mongoose");

const workingHoursSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  schedule: [{
    day: { type: String, enum: ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"] },
    nonWorkingDay: { type: Boolean, default: false },
    workingHours: {
      from: { type: String, required: true },
      to: { type: String, required: true }
    },
    break: {
      from: { type: String, required: true },
      to: { type: String, required: true }
    }
  }]
});

const WorkingHours = mongoose.model("WorkingHours", workingHoursSchema);
module.exports = WorkingHours; 