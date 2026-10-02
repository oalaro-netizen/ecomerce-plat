import express from "express";
import { createCheckout, verifyPayment, webhookHandler } from "../controllers/checkout.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/", requireAuth, createCheckout);
router.post("/verify", requireAuth, verifyPayment);
router.post("/paystack/webhook", express.json({ type: "application/json" }), webhookHandler);

export default router;