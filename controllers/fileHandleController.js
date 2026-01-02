import { removeImage, uploadImage } from "../utils/cloudinaryUtils";

const uploadFile = async (req, res) => {
  if (!req.file) {
    return res.status(400).send("No file uploaded");
  }

  try {
    const imageUrl = await uploadImage(req.file.buffer, "my_images");
    return res
      .status(200)
      .json({ message: "Upload successful", url: imageUrl });
  } catch (error) {
    return res.status(500).json({ message: "Upload failed", error });
  }
};

const deleteFile = async (req, res) => {
  const { publicId } = req.body;

  try {
    const result = await removeImage(publicId);
    return res
      .status(200)
      .json({ message: "Image deleted successfully", result });
  } catch (error) {
    return res.status(500).json({ message: "Deletion failed", error });
  }
};

module.exports = { uploadFile, deleteFile };
