import { v2 as cloudinary } from "cloudinary";
import mongoose from "mongoose";
import User from "../models/user.model.js";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadProfile = async (req, res) => {
  try {
    const userId = req.user?._id || req.user?.id || req.body.userId;
    if (!userId) return res.status(400).json({ message: "userId required" });
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Update fields
    if (req.body.phone !== undefined) user.phone = req.body.phone;
    if (req.body.dob !== undefined) user.dob = req.body.dob;
    if (req.body.address !== undefined) user.address = req.body.address;

    // Upload image using SDK if file provided
    if (req.body.imageUrl) user.avatar = req.body.imageUrl;
    if (req.file || req.body.file) {
      // Assume multer or base64; for SDK upload from buffer/file
      // Here using a simple upload from base64 or path if available
      const imagePath = req.file?.path || req.body.file;
      const result = await cloudinary.uploader.upload(imagePath, {
        folder: "user-avatars",
      });
      user.avatar = result.secure_url;
    }

    await user.save();
    res.json({ message: "Profile updated", user: { ...user.toObject(), passwordHash: undefined } });
  } catch (err) {
    console.error(err);
    if (err.name === "CastError") return res.status(404).json({ message: "User not found" });
    res.status(500).json({ message: err.message });
  }
};
