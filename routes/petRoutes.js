const express = require("express");
const multer = require("multer");
const {
  getAllPets,
  getPetById,
  createPet,
  updatePet,
  deletePet,
} = require("../controllers/petController.js");
const { protect } = require("../middleware/auth.js");
const { restrictTo } = require("../middleware/roleCheck.js");
const { uploadImage, removeImage } = require("../utils/cloudinaryUtils.js");
const router = express.Router();

// Set up multer storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB limit
});

router.get("/", getAllPets);
router.get("/:id", getPetById);

// Admin only routes
router.use(protect, restrictTo("admin"));
router.post("/", createPet);
router.put("/:id", updatePet);
router.delete("/:id", deletePet);

router.post("/upload", upload.single("image"), (req, res, next) => {
  if (!req.file || !req.file.buffer) {
    return res.status(400).send("No image uploaded");
  }

  uploadImage(req.file.buffer) // pass the buffer from multer to uploadImage
    .then((imageUrl) => {
      res.status(200).send({ imageUrl });
    })
    .catch(next);
});
router.delete("/delete", removeImage);

module.exports = router;
