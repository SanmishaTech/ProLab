// models/user.js
const mongoose = require("mongoose");

const reference = new mongoose.Schema({
  name: { type: String },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

const Reference = mongoose.model("Reference", reference);
module.exports = Reference;
