const mongoose = require("mongoose");

const mackercheckerSchema = new mongoose.Schema({
  department: { type: mongoose.Schema.Types.ObjectId, ref: "Department" },
  checker: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  level: { type: String, enum: ["level1", "level2"] },
  test: [{ type: mongoose.Schema.Types.ObjectId, ref: "Test" }],

  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

const Makerchecker = mongoose.model("MakerChecker", mackercheckerSchema);
module.exports = Makerchecker;
