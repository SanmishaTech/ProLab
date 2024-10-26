// models/service.js

const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  urgentPrice: { type: Number, required: true }, // Price when service is urgent
  durationInDays: { type: Number, required: true }, // Regular duration
  urgentDuration: { type: Number, required: true }, // Duration when urgent
  urgent: { type: Boolean, default: false }, // Urgent status
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Assuming services are user-specific
  // Add other necessary fields if any
});

const Service = mongoose.model("Service", serviceSchema);
module.exports = Service;
