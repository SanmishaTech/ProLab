// models/corporatemaster.js

const mongoose = require("mongoose");

const roleMasterSchema = new mongoose.Schema({
  role: { type: String },
  description: { type: String },
});

const RoleMaster = mongoose.model("RoleMaster", roleMasterSchema);
module.exports = RoleMaster;
