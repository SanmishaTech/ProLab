// models/holiday.js

const mongoose = require("mongoose");

const discountMasterSchema = new mongoose.Schema({
  discountType: { type: String },
  value: { type: Number },
  description: { type: String },
});

const DiscountMaster = mongoose.model("DiscountMaster", discountMasterSchema);
module.exports = DiscountMaster;
