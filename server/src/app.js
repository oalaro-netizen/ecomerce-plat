import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import healthRoutes from "./routes/health.routes.js";
import authRoutes from "./routes/auth.routes.js";
import uploadRoutes from "./routes/upload.routes.js";
import productRoutes from "./routes/product.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import checkoutRoutes from "./routes/checkout.routes.js";
import {
  notFoundHandler,
  errorHandler,
} from "./middleware/errorHandler.js";

const app = express();

// Allow the local Vite dev server to call this API.
// credentials:true lets the auth cookie cross origins.
app.use(
  cors({
    origin: (origin, cb) => {
      // Allow localhost Vite dev ports in development
      const allowed = [
        process.env.CLIENT_ORIGIN,
        "http://localhost:5173",
        "http://localhost:5174",
        "http://localhost:5175",
      ];
      if (allowed.includes(origin) || !origin || process.env.NODE_ENV === "development") {
        return cb(null, true);
      }
      return cb(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/api/health", healthRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/products", productRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/checkout", checkoutRoutes);

// 404 + error handling must run after all routes
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
