// models/user.js
const mongoose = require("mongoose");

const barcodeSchema = new mongoose.Schema({
  Registration: { type: mongoose.Schema.Types.ObjectId, ref: "Registration" },
  Tests: [{ type: mongoose.Schema.Types.ObjectId, ref: "TestMaster" }],
});

const Barcode = mongoose.model("Barcode", barcodeSchema);
module.exports = Barcode;
