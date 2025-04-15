import express from "express";
import fs from "fs";
import path from "path";

const router = express.Router();
const productsPath = path.resolve("./public/data/products.json");

// Utility to load product data
function loadProducts() {
  const data = fs.readFileSync(productsPath, "utf-8");
  return JSON.parse(data);
}

// API endpoint to get product by id
router.get("/:id", (req, res) => {
  const products = loadProducts();
  const productId = parseInt(req.params.id);
  const product = products.find(p => p.id === productId);

  if (product) {
    res.json(product);
  } else {
    res.status(404).json({ message: "Product not found" });
  }
});

export default router;