import Product from "../models/product.model.js";

export const getAllProducts = async (req, res) => {
  const products = await Product.find().sort({ createdAt: -1 });
  res.json({ products });
};

export const getProductById = async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ message: "Product not found" });
  res.json({ product });
};

export const createProduct = async (req, res) => {
  const { name, description, price, category, images, stock } = req.body;
  const product = await Product.create({
    name,
    description,
    price,
    category,
    images: Array.isArray(images) ? images : [images].filter(Boolean),
    stock: stock || 0,
  });
  res.status(201).json({ product });
};

export const updateProduct = async (req, res) => {
  const { name, description, price, category, images, stock } = req.body;
  const updateData = {
    ...(name !== undefined ? { name } : {}),
    ...(description !== undefined ? { description } : {}),
    ...(price !== undefined ? { price } : {}),
    ...(category !== undefined ? { category } : {}),
    ...(images !== undefined ? { images: Array.isArray(images) ? images : [images].filter(Boolean) } : {}),
    ...(stock !== undefined ? { stock } : {}),
  };
  const product = await Product.findByIdAndUpdate(req.params.id, updateData, { new: true });
  if (!product) return res.status(404).json({ message: "Product not found" });
  res.json({ product });
};

export const deleteProduct = async (req, res) => {
  const product = await Product.findByIdAndDelete(req.params.id);
  if (!product) return res.status(404).json({ message: "Product not found" });
  res.json({ message: "Product deleted" });
};
