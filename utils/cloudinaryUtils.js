require("dotenv").config();
const cloudinary = require("cloudinary").v2;
const streamifier = require("streamifier");

// Set up Cloudinary variables for security
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Function to upload an image to Cloudinary
const uploadImage = (imageBuffer, folderName = "image") => {
  // Check if imageBuffer is a Buffer before proceeding
  if (!Buffer.isBuffer(imageBuffer)) {
    return Promise.reject(
      new Error("The provided image is not a valid Buffer")
    );
  }

  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: folderName },
      (error, result) => {
        if (error) {
          return reject(error);
        }
        return resolve(result.secure_url); // Return the image URL
      }
    );

    // Convert the image buffer into a readable stream and upload it
    streamifier.createReadStream(imageBuffer).pipe(stream);
  });
};

// Function to remove an image from Cloudinary
const removeImage = (publicId) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.destroy(publicId, (error, result) => {
      if (error) {
        return reject(error);
      }
      return resolve(result); // Return result of the deletion
    });
  });
};

module.exports = { uploadImage, removeImage };
