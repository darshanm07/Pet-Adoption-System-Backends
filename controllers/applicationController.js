const Application = require("../models/Application.js");
const Pet = require("../models/Pet.js");
const messaging = require("../services/firebase.js");

const createApplication = async (req, res) => {
  try {
    const pet = await Pet.findById(req.body.pet);

    if (!pet) {
      return res.status(404).json({ message: "Pet not found" });
    }

    if (pet.status !== "Available") {
      return res.status(400).json({
        message: "This pet is not available for adoption",
      });
    }

    // Check for existing application
    const existingApp = await Application.findOne({
      user: req.user._id,
      pet: req.body.pet,
    });

    if (existingApp) {
      return res.status(400).json({
        message: "You have already applied for this pet",
      });
    }

    const application = await Application.create({
      user: req.user._id,
      pet: req.body.pet,
      reason: req.body.reason,
      experience: req.body.experience,
      housingType: req.body.housingType,
      hasYard: req.body.hasYard,
      otherPets: req.body.otherPets,
    });

    // Update pet status to Pending
    await Pet.findByIdAndUpdate(req.body.pet, { status: "Pending" });

    // Send notification to Admin
    const adminToken = "Admin_FCM_Token"; // You'll need to get the FCM token of the admin from your database or settings
    const message = {
      notification: {
        title: "New Adoption Application",
        body: `A new application has been submitted for ${pet.name}`,
      },
      token: adminToken,
    };

    await messaging.send(message);

    res.status(201).json({
      success: true,
      application,
      message: "Application submitted successfully",
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getUserApplications = async (req, res) => {
  try {
    const applications = await Application.find({ user: req.user._id })
      .populate("pet", "name species breed image status")
      .sort({ createdAt: -1 });

    res.json({ success: true, applications });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllApplications = async (req, res) => {
  try {
    const { status } = req.query;
    const query = status ? { status } : {};

    const applications = await Application.find(query)
      .populate("user", "name email phone")
      .populate("pet", "name species breed image")
      .sort({ createdAt: -1 });

    res.json({ success: true, applications });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateApplicationStatus = async (req, res) => {
  try {
    const { status, adminNotes } = req.body;
    const application = await Application.findById(req.params.id);

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    application.status = status;
    application.adminNotes = adminNotes || "";
    application.reviewedBy = req.user._id;
    application.reviewedAt = Date.now();
    await application.save();

    // Send notification to the user
    const userToken = application.user.fcmToken; // Retrieve user's FCM token
    const userMessage = {
      notification: {
        title: `Your application has been ${status}`,
        body: `Your application for ${
          application.pet.name
        } has been ${status.toLowerCase()}. ${adminNotes || ""}`,
      },
      token: userToken,
    };

    await messaging.send(userMessage);

    // Update pet status
    const pet = await Pet.findById(application.pet);
    if (status === "Approved") {
      pet.status = "Adopted";
      pet.adoptedBy = application.user;
      pet.adoptedAt = Date.now();

      // Reject other pending applications for this pet
      await Application.updateMany(
        { pet: application.pet, _id: { $ne: application._id } },
        { status: "Rejected", adminNotes: "Pet adopted by another user" }
      );
    } else if (status === "Rejected") {
      // Check if there are other pending applications
      const pendingApps = await Application.countDocuments({
        pet: application.pet,
        status: "Pending",
      });

      if (pendingApps === 0) {
        pet.status = "Available";
      }
    }
    await pet.save();

    res.json({
      success: true,
      application,
      message: "Application status updated successfully",
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  createApplication,
  getUserApplications,
  getAllApplications,
  updateApplicationStatus,
};
