const mongoose = require("mongoose");

const machineLinkMaster = new mongoose.Schema({
  name: { type: mongoose.Schema.Types.ObjectId, ref: "MachineMaster" },
  test: { type: mongoose.Schema.Types.ObjectId, ref: "TestMaster" },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

const MachineLinkMaster = mongoose.model(
  "MachineLinkMaster",
  machineLinkMaster
);
module.exports = MachineLinkMaster;
