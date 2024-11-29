// models/user.js
const mongoose = require("mongoose");

const reasonSchema = new mongoose.Schema({
  name: { type: String },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

const Reason = mongoose.model("Reason", reasonSchema);
module.exports = Reason;
