// models/user.js
const mongoose = require("mongoose");

const highlighterSchema = new mongoose.Schema({
  useBoldFonts: { type: Boolean, default: false },
  useUnderline: { type: Boolean, default: false },
  backgroundColor: { type: String },
  highLowValues: { type: Boolean, default: false },
});

const Highlighter = mongoose.model("highlighter", highlighterSchema);
module.exports = Highlighter;
