import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  customer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  products: [{
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
    name: String,
    priceAtPurchase: Number,
    qty: Number,
  }],
  total: { type: Number, required: true },
  delivery: { country: String, state: String, localGovernment: String, address: String, phone: String, notes: String },
  status: { type: String, default: "pending" },
  paymentStatus: { type: String, default: "pending" },
  reference: String,
  paystackRef: String,
  paidAt: Date,
}, { timestamps: true });

export default mongoose.model("Order", orderSchema);