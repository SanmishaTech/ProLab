// models/user.js
const mongoose = require("mongoose");

const servicesSchema = new mongoose.Schema({
  name: { type: String },
  specialization: { type: String },
  qualification: { type: String },
  phone: { type: String },
  email: { type: String },
  experienceYears: { type: Number },
  branch: { type: String },
  availableSlots: { type: Array },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

const Service = mongoose.model("Services", servicesSchema);
module.exports = Service;
