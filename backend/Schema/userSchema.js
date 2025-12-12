// models/user.js
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: { type: String },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  role: { type: String, default: "user" },
  lab: [{ type: mongoose.Schema.Types.ObjectId, ref: "Lab" }],
  creationDate: { type: Date, default: Date.now },
});

const User = mongoose.model("User", userSchema);
module.exports = User;
