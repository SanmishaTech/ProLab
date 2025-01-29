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
const collectionCenter = new mongoose.Schema({
  collectionCenterName: {
    type: String,
    default: "Impact Dignostics",
  },
  collectionTime: {
    type: Date,
    default: Date.now,
  },
});

const testSchema = new mongoose.Schema({
  tests: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "TestMaster",
  },
  tat: {
    type: Number, // Hours needed for the test
    required: true,
    default: 24,
  },
  urgent: {
    type: Boolean,
    default: false,
  },
  urgentTime: {
    type: Number, // Hours needed for urgent processing
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
  startTime: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ["pending", "collected", "rejected"],
    default: "pending",
  },
  expectedCompletionTime: {
    type: Date,
    required: true,
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
const paymentHistorySchema = new mongoose.Schema({
  paymentMode: {
    type: String,
  },
  paidAmount: {
    type: Number,
  },
  paymentDate: {
    type: String,
  },
  staffName: {
    type: String,
  },
  paymentDetails: {
    type: String,
  },
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
    paymentHistory: [paymentHistorySchema],
    collectionCenter: [collectionCenter],
    registrationTime: {
      type: Date,
      default: Date.now,
    },

    status: {
      type: String,
      enum: ["pending", "in_progress", "completed", "delayed"],
      default: "pending",
    },
  },
  { timestamps: true }
);

const Registration = mongoose.model("Registration", registrationSchema);
module.exports = Registration;
