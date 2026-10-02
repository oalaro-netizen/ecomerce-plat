import { Router } from "express";
import passport from "passport";
import "../config/passport.js";
import {
  registerHandler,
  loginHandler,
  logoutHandler,
  meHandler,
  updateProfileHandler,
  getAllUsersHandler,
} from "../controllers/auth.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";

const router = Router();

router.post("/register", registerHandler);
router.post("/login", loginHandler);
router.post("/logout", logoutHandler);
router.get("/me", requireAuth, meHandler);
router.get("/users", requireAuth, getAllUsersHandler);
router.put("/me", requireAuth, updateProfileHandler);

router.get("/google", passport.authenticate("google", { scope: ["profile", "email"], session: false }));
router.get("/google/callback", passport.authenticate("google", { session: false, failureRedirect: "/login" }), (req, res) => {
  console.log("GOOGLE CALLBACK REACHED");
  console.log("GOOGLE PROFILE RECEIVED:", !!req.user);
  console.log("USER LOOKUP COMPLETED:", req.user ? req.user.email : "none");
  console.log("TOKEN GENERATION STARTED");
  const jwt = require("jsonwebtoken");
  const token = req.user ? jwt.sign({ sub: req.user._id.toString(), role: req.user.role }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }) : null;
  res.cookie("token", token, { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", maxAge: 7 * 24 * 60 * 60 * 1000 });
  console.log("TOKEN GENERATION COMPLETED");
  console.log("REDIRECT STARTED");
  const redirect = req.user?.role === "admin" ? "/admin" : "/shop";
  res.redirect(`${process.env.CLIENT_ORIGIN}${redirect}`);
});

export default router;
