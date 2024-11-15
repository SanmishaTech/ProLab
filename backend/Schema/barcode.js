// models/user.js
const mongoose = require("mongoose");

const barcodeSchema = new mongoose.Schema({
  patientName: { type: Boolean, default: false },
  patientId: { type: Boolean, default: false },
  sid: { type: Boolean, default: false },
  dateOfAppointment: { type: Boolean, default: false },
  timeOfAppointment: { type: Boolean, default: false },
  testName: { type: Boolean, default: false },
  testAbbreviation: { type: Boolean, default: false },
  container: { type: Boolean, default: false },
});

const Barcode = mongoose.model("Barcode", barcodeSchema);
module.exports = Barcode;
