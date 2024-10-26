// models/user.js
const mongoose = require("mongoose");

const labSchema = new mongoose.Schema({
  name: { type: String },
});

const Lab = mongoose.model("Lab", labSchema);
module.exports = Lab;
