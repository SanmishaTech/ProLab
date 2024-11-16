const mongoose = require("mongoose");

const machineSchema = new mongoose.Schema({
  name: { type: String },
  model: { type: String },
  companyName: { type: String },
});

const MachineMaster = mongoose.model("MachineMaster", machineSchema);
module.exports = MachineMaster;
