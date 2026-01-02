const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    pet: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Pet",
      required: true,
    },
    reason: {
      type: String,
      required: [true, "Please provide a reason for adoption"],
      minlength: 50,
    },
    experience: {
      type: String,
      required: [true, "Please describe your experience with pets"],
    },
    housingType: {
      type: String,
      enum: ["House", "Apartment", "Farm", "Other"],
      required: true,
    },
    hasYard: {
      type: Boolean,
      default: false,
    },
    otherPets: {
      type: String,
      default: "None",
    },
    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"],
      default: "Pending",
    },
    adminNotes: {
      type: String,
      default: "",
    },
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    reviewedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent duplicate applications
applicationSchema.index({ user: 1, pet: 1 }, { unique: true });

module.exports = mongoose.model("Application", applicationSchema);
