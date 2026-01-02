const mongoose = require("mongoose");

const petSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Pet name is required"],
      trim: true,
    },
    species: {
      type: String,
      required: [true, "Species is required"],
      enum: ["Dog", "Cat", "Bird", "Rabbit", "Other"],
    },
    breed: {
      type: String,
      required: [true, "Breed is required"],
      trim: true,
    },
    age: {
      type: Number,
      required: [true, "Age is required"],
      min: 0,
    },
    gender: {
      type: String,
      enum: ["Male", "Female"],
      required: true,
    },
    size: {
      type: String,
      enum: ["Small", "Medium", "Large"],
      required: true,
    },
    color: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      minlength: 20,
    },
    medicalHistory: {
      type: String,
      default: "No medical history available",
    },
    vaccinated: {
      type: Boolean,
      default: false,
    },
    image: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      enum: ["Available", "Pending", "Adopted"],
      default: "Available",
    },
    adoptedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    adoptedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for search and filter
petSchema.index({ name: "text", breed: "text" });
petSchema.index({ species: 1, status: 1 });

module.exports = mongoose.model("Pet", petSchema);
