// models/user.js
const mongoose = require("mongoose");

const promoCodeMasterSchema = new mongoose.Schema({
  promoCode: { type: String },
  description: { type: String },
  promoType: { type: String },
  value: { type: Number },
  validityDate: { type: Date },
});

const PromoCodeMaster = mongoose.model(
  "promoCodeMaster",
  promoCodeMasterSchema
);
module.exports = PromoCodeMaster;
