// models/user.js
const mongoose = require("mongoose");

const testlinkmasterSchema = new mongoose.Schema({
  test: { type: mongoose.Schema.Types.ObjectId, ref: "TestMaster" },
  parameterGroup: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ParameterGroup",
  },
  parameter: { type: mongoose.Schema.Types.ObjectId, ref: "Parameter" },
});

const TestLinkMaster = mongoose.model("TestLinkMaster", testlinkmasterSchema);
module.exports = TestLinkMaster;
