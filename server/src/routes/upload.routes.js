import express from "express";
import multer from "multer";
import { requireAuth } from "../middleware/auth.middleware.js";
import { uploadProfile } from "../controllers/upload.controller.js";

const upload = multer({ dest: "uploads/" });
const router = express.Router();
router.post("/", requireAuth, upload.single("file"), uploadProfile);
router.post("/url", requireAuth, express.json(), uploadProfile);

export default router;
