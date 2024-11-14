// models/user.js
const mongoose = require("mongoose");

const reasonSchema = new mongoose.Schema({
  name: { type: String },
});

const Reason = mongoose.model("Reason", reasonSchema);
module.exports = Reason;
