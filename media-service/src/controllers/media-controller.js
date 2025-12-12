import logger from "../utils/logger.js";
import uploadMediaToCloudinary from "../utils/cloudinary.js";

const uploadMedia = async (req, res) => {
  logger.info("Starting media upload");

  try {
    if (!req.file) {
      logger.error("No file found. Please try add a file and try again");
      return res.status(400).json({
        success: false,
        message: "No file found. Please add a file and try again!",
      });
    }

    const { originalName, mimeType, buffer } = req.file;
    const userId = req.user.userId;

    logger.info(`File details: name=${originalName}, type=${mimeType}`);
    logger.info(`Uploading to cloudinary starting...`);

    const cloudinaryUploadResult = await uploadMediaToCloudinary(req.file);
    logger.info(
      `Cloudinary upload successfully. Public ID ${cloudinaryUploadResult.public_id}`
    );

    const newlyCreatedMedia = new MediaCapabilities({
      publicId: cloudinaryUploadResult.public_id,
      originalName,
      mimeType,
      url: cloudinaryUploadResult.secure_url,
      userId: userId,
    });

    await newlyCreatedMedia.save();

    res.status(201).json({
      success: true,
      mediaId: newlyCreatedMedia._id,
      url: newlyCreatedMedia.url,
      message: "Media upload is successfull",
    });
  } catch (e) {
    logger.error("Error uploading the file", e);
    res.status(500).json({
      success: false,
      message: "Error uploading the file",
    });
  }
};

export { uploadMedia };
