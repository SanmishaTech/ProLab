const mongoose = require("mongoose");

const containerLinkMaster = new mongoose.Schema({
  test: { type: mongoose.Schema.Types.ObjectId, ref: "TestMaster" },
  name: [{ type: mongoose.Schema.Types.ObjectId, ref: "Container" }],
});

const ContainerLinkMaster = mongoose.model(
  "ContainerLinkMaster",
  containerLinkMaster
);
module.exports = ContainerLinkMaster;
