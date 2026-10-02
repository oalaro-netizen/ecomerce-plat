import Product from "../models/product.model.js";

export const purchaseProduct = async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ message: "Product not found" });
  const qty = Math.max(1, Number(req.body.qty || 1));
  if (product.stock < qty) return res.status(400).json({ message: "Not enough stock" });
  product.stock -= qty;
  await product.save();
  res.json({ product, message: "Purchase successful" });
};
