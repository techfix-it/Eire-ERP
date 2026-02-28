import { Router } from "express";
import db from "../db.js";

const router = Router();

// Middleware to check auth
const auth = (req: any, res: any, next: any) => {
  const token = req.headers.authorization;
  if (!token) return res.status(401).json({ error: "Unauthorized" });
  const user = db.prepare("SELECT * FROM users WHERE id = ?").get(token);
  if (!user) return res.status(401).json({ error: "Unauthorized" });
  req.user = user;
  next();
};

router.use(auth);

router.get("/", (req, res) => {
  const products = db.prepare("SELECT * FROM products").all() as any[];
  res.json(products.map(p => ({
    ...p,
    attributes: p.attributes ? JSON.parse(p.attributes) : {},
    images: p.images ? JSON.parse(p.images) : []
  })));
});

router.post("/", (req, res) => {
  const { name, sku, brand, category, condition, description, attributes, images, price, stock_quantity, vat_rate } = req.body;
  try {
    db.prepare(`
      INSERT INTO products (name, sku, brand, category, condition, description, attributes, images, price, stock_quantity, vat_rate) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      name, sku, brand, category, condition, description, 
      JSON.stringify(attributes || {}), JSON.stringify(images || []), 
      price, stock_quantity, vat_rate || 23.0
    );
    res.json({ success: true });
  } catch (e) {
    res.status(400).json({ error: "SKU must be unique or missing fields" });
  }
});

router.put("/:id", (req, res) => {
  const { id } = req.params;
  const { name, sku, brand, category, condition, description, attributes, images, price, stock_quantity, vat_rate } = req.body;
  try {
    db.prepare(`
      UPDATE products SET 
        name = ?, sku = ?, brand = ?, category = ?, condition = ?, 
        description = ?, attributes = ?, images = ?, price = ?, 
        stock_quantity = ?, vat_rate = ?
      WHERE id = ?
    `).run(
      name, sku, brand, category, condition, 
      description, JSON.stringify(attributes || {}), JSON.stringify(images || []), 
      price, stock_quantity, vat_rate, id
    );
    res.json({ success: true });
  } catch (e) {
    res.status(400).json({ error: "Error updating product" });
  }
});

router.delete("/:id", (req, res) => {
  const { id } = req.params;
  db.prepare("DELETE FROM products WHERE id = ?").run(id);
  res.json({ success: true });
});

export default router;
