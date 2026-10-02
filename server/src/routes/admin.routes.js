import express from "express";
import Order from "../models/order.model.js";
import User from "../models/user.model.js";
import Product from "../models/product.model.js";
import { requireAuth } from "../middleware/auth.middleware.js";
import { requireAdmin } from "../middleware/admin.middleware.js";

const router = express.Router();

router.get("/orders", requireAuth, requireAdmin, async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 }).populate("customer", "name email").lean();
    res.json({ orders });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/customers", requireAuth, requireAdmin, async (req, res) => {
  try {
    const users = await User.find({}).select("name email role avatar phone dob createdAt").sort({ createdAt: -1 }).lean();
    res.json({ users });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/stats", requireAuth, requireAdmin, async (req, res) => {
  try {
    const products = await Product.find();
    const orders = await Order.find();
    const users = await User.countDocuments({ role: "customer" });
    const totalRevenue = orders.reduce((sum, o) => sum + (o.total || 0), 0);
    const lowStock = products.filter(p => p.stock <= 5).length;
    res.json({
      totalProducts: products.length,
      totalOrders: orders.length,
      totalCustomers: users,
      totalRevenue,
      lowStockCount: lowStock,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
