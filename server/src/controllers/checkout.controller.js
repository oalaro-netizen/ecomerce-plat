import crypto from "crypto";
import Order from "../models/order.model.js";
import Product from "../models/product.model.js";
import { initializeTransaction, verifyTransaction } from "../services/paystack.service.js";

// Verify Paystack webhook signature using HMAC-SHA512.
// We verify on every webhook event and only act after an official
// /transaction/verify confirmation, so spoofed callbacks are rejected.
function verifyWebhookSignature(req) {
  const signature = req.headers["x-paystack-signature"];
  if (!signature) return false;
  const hmac = crypto.createHmac("sha512", process.env.PAYSTACK_SECRET_KEY);
  const digest = "sha512=" + hmac.update(JSON.stringify(req.body)).digest("hex");
  return crypto.timingSafeEqual(Buffer.from(digest), Buffer.from(signature));
}

// Mark an order as paid AND reduce stock exactly once. Used by both
// the explicit verify endpoint and the verified webhook handler.
async function markOrderPaid(order, verified) {
  if (order.paymentStatus === "paid") return order; // idempotent: no double stock deduction
  for (const item of order.products) {
    const p = await Product.findById(item.product);
    if (p) {
      p.stock -= item.qty;
      await p.save();
    }
  }
  order.paymentStatus = "paid";
  order.status = "paid";
  order.paystackRef = verified.reference;
  order.paidAt = new Date();
  await order.save();
  return order;
}

export const createCheckout = async (req, res) => {
  try {
    const { cart, delivery } = req.body; // cart: array of {id, qty}
    if (!Array.isArray(cart) || cart.length === 0) return res.status(400).json({ message: "Cart empty" });

    // Calculate total from DB (never trust frontend price)
    let total = 0;
    const products = [];
    for (const item of cart) {
      const product = await Product.findById(item.id);
      if (!product) return res.status(404).json({ message: `Product ${item.id} not found` });
      if (product.stock < item.qty) return res.status(400).json({ message: `Not enough stock for ${product.name}` });
      total += product.price * item.qty;
      products.push({ product: product._id, name: product.name, priceAtPurchase: product.price, qty: item.qty });
    }

    const order = await Order.create({
      customer: req.user.id,
      products,
      total,
      delivery: delivery || {},
      reference: `order-${Date.now()}-${req.user.id}`,
    });

    const paystackInit = await initializeTransaction(req.user.email, total, order.reference, `${process.env.CLIENT_ORIGIN || "http://localhost:5173"}/checkout/confirm`);

    res.json({ authorizationUrl: paystackInit.authorization_url, reference: paystackInit.reference, orderId: order._id });
  } catch (err) {
    console.error("Checkout error:", err);
    res.status(500).json({ message: err.message || "Checkout failed" });
  }
};

export const verifyPayment = async (req, res) => {
  try {
    const { reference } = req.body;
    if (!reference) return res.status(400).json({ message: "Reference required" });
    const verified = await verifyTransaction(reference);

    const order = await Order.findOne({ reference });
    if (!order) return res.status(404).json({ message: "Order not found" });

    // Confirm Paystack-reported amount matches the order total
    if (verified.amount !== Math.round(order.total * 100)) return res.status(400).json({ message: "Amount mismatch" });

    await markOrderPaid(order, verified);

    res.json({ message: "Payment verified", order });
  } catch (err) {
    console.error("Verify error:", err);
    res.status(500).json({ message: err.message || "Verification failed" });
  }
};

export const webhookHandler = async (req, res) => {
  // Validate signature first — reject forged callbacks immediately
  if (!verifyWebhookSignature(req)) {
    console.warn("Invalid Paystack webhook signature", { signature: req.headers["x-paystack-signature"] });
    return res.status(400).json({ status: "invalid signature" });
  }

  try {
    const payload = req.body;
    const event = payload.event;
    if (event === "charge.success") {
      const ref = payload.data.reference;
      const verified = await verifyTransaction(ref);
      const order = await Order.findOne({ reference: ref });
      if (!order) return res.status(200).json({ status: "ok" });

      // Idempotency: skip if already paid
      if (order.paymentStatus === "paid") return res.status(200).json({ status: "already paid" });

      if (verified.amount === Math.round(order.total * 100)) {
        await markOrderPaid(order, verified);
      } else {
        console.warn(`Webhook amount mismatch for ref ${ref}`);
      }
    }
    res.status(200).json({ status: "ok" });
  } catch (err) {
    console.error("Webhook error:", err);
    res.status(200).json({ status: "ignored" });
  }
};