// models/user.js
const mongoose = require("mongoose");

const Paymentmodeschema = new mongoose.Schema({
  paymentMode: { type: String },
  description: { type: String },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

const Paymentmode = mongoose.model("Paymentmode", Paymentmodeschema);
module.exports = Paymentmode;
