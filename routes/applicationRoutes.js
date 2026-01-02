const express = require("express");
const {
  createApplication,
  getUserApplications,
  getAllApplications,
  updateApplicationStatus,
} = require("../controllers/applicationController.js");
const { protect } = require("../middleware/auth.js");
const { restrictTo } = require("../middleware/roleCheck.js");
const router = express.Router();

router.use(protect);

router.post("/", createApplication);
router.get("/my-applications", getUserApplications);

// Admin only routes
router.get("/", restrictTo("admin"), getAllApplications);
router.patch("/:id/status", restrictTo("admin"), updateApplicationStatus);

module.exports = router;
