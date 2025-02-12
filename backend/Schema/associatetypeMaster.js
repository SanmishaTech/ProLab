// models/Autocomplete.js

const mongoose = require("mongoose");

const associatetypeSchema = new mongoose.Schema({
  associateType: { type: "String" },
  refferedBy: { type: Boolean },
  requisitionTo: { type: Boolean },

  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

const AssociateType = mongoose.model("AssociateType", associatetypeSchema);
module.exports = AssociateType;
