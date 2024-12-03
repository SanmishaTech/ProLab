const mongoose = require("mongoose");

const patientschema = new mongoose.Schema({
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Patient",
    required: true,
  },
});
const referralschema = new mongoose.Schema({
  primaryRefferal: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "AssociateMaster",
  },
  secondaryRefferal: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "AssociateMaster",
  },
  billedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "AssociateMaster",
  },
  coporateCustomer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "CorporateMaster",
    default: null,
  },
  clinicHistory: {
    type: String,
    default: null,
  },
  medicationHistory: {
    type: String,
    default: null,
  },
});

const testSchema = new mongoose.Schema({
  tests: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "TestMaster",
  },

  tat: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TatMaster",
      required: true,
      default: null,
    },
  ],
  urgentTime: {
    type: Date,
    default: null,
  },
  outsourced: {
    type: Boolean,
    default: false,
  },
  price: {
    type: Number,
    default: 0,
  },
});

const discountschema = new mongoose.Schema({
  discountapplied: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "DiscountMaster",
    default: null,
  },
  dicountReason: {
    type: String,
    default: null,
  },
  discountValue: {
    type: Number,
    default: 0,
  },
});

const homevisitschema = new mongoose.Schema({
  homevisitAssignedto: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "AssociateMaster",
    default: null,
  },
  visitCharges: {
    type: Number,
    default: 0,
  },
});

const paymentModeschema = new mongoose.Schema({
  paymentMode: {
    type: String,
    required: true,
  },
  paidAmount: {
    type: Number,
    required: true,
  },
});

const paymentDeliverySchema = new mongoose.Schema({
  paymentDeliveryMode: [
    {
      type: String,
      required: true,
    },
  ],
});

const registrationSchema = new mongoose.Schema(
  {
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PatientMaster",
      required: true,
    },
    referral: [referralschema],
    tests: [testSchema],
    totaltestprice: {
      type: Number,
      default: 0,
    },
    discount: [discountschema],
    priceAfterDiscount: {
      type: Number,
      default: 0,
    },
    homevisit: [homevisitschema],
    priceafterhomevisit: {
      type: Number,
      default: 0,
    },
    paymentMode: [paymentModeschema],
    totalBalance: {
      type: Number,
      default: 0,
    },
    paymentDeliveryMode: [paymentDeliverySchema],
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

const Registration = mongoose.model("Registration", registrationSchema);
module.exports = Registration;
