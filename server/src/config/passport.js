import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User from "../models/user.model.js";

const hasClientID = !!process.env.GOOGLE_CLIENT_ID;
const hasClientSecret = !!process.env.GOOGLE_CLIENT_SECRET;
console.log("Google OAuth config loaded. clientID present:", hasClientID, "clientSecret present:", hasClientSecret);

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.GOOGLE_CALLBACK_URL,
  passReqToCallback: false,
}, async (accessToken, refreshToken, profile, done) => {
  try {
    const email = profile.emails?.[0]?.value;
    if (!email) return done(new Error("No email from Google"), null);
    let user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      user = await User.create({
        name: profile.displayName || "User",
        email: email.toLowerCase(),
        passwordHash: "google-auth",
        role: "customer",
        emailVerified: true,
        googleId: profile.id,
      });
    } else {
      if (!user.googleId) user.googleId = profile.id;
      if (!user.emailVerified) user.emailVerified = true;
      await user.save();
    }
    return done(null, user);
  } catch (e) {
    console.error("Google OAuth verify error:", e.name || e.constructor?.name, e.message, "stack:", e.stack?.split("\n").slice(0,3).join(" "));
    return done(e, null);
  }
}));

passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
  try { done(null, await User.findById(id)); } catch (e) { done(e, null); }
});
