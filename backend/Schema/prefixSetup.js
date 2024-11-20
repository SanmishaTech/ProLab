const mongoose = require("mongoose");

const prefixSchema = new mongoose.Schema({
  prefixFor: {
    type: String,
    required: true,
    enum: ["sid", "patient", "invoice"],
  },
  prefix: {
    type: String,
    required: true,
  },
  suffix: {
    type: String,
    required: true,
  },
  separator: {
    type: String,
    required: true,
  },
  digits: {
    type: String,
    required: true,
  },
  startNumber: {
    type: Number,
    required: true,
  },
  resetToStart: {
    type: Boolean,
    required: true,
  },
});

module.exports = mongoose.model("Prefix", prefixSchema);
