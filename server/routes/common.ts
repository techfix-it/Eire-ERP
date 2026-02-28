import express, { Router } from "express";
import db from "../db.js";

const router = Router();

interface CustomRequest extends express.Request {
  user?: any;
}

const auth = (req: CustomRequest, res: any, next: any) => {
  const token = req.headers.authorization;
  if (!token) return res.status(401).json({ error: "Unauthorized" });
  const user = db.prepare("SELECT * FROM users WHERE id = ?").get(token);
  if (!user) return res.status(401).json({ error: "Unauthorized" });
  req.user = user;
  next();
};

router.use(auth);

// Brands
router.get("/brands", (req, res) => {
  res.json(db.prepare("SELECT * FROM brands").all());
});

router.post("/brands", (req, res) => {
  const { name, image_url, description } = req.body;
  try {
    db.prepare("INSERT INTO brands (name, image_url, description) VALUES (?, ?, ?)")
      .run(name, image_url, description);
    res.json({ success: true });
  } catch (e) {
    res.status(400).json({ error: "Brand name must be unique" });
  }
});

router.delete("/brands/:id", (req, res) => {
  db.prepare("DELETE FROM brands WHERE id = ?").run(req.params.id);
  res.json({ success: true });
});

// Attributes
router.get("/attributes", (req, res) => {
  res.json(db.prepare("SELECT * FROM attribute_definitions").all());
});

router.post("/attributes", (req, res) => {
  const { name, label, type } = req.body;
  try {
    db.prepare("INSERT INTO attribute_definitions (name, label, type) VALUES (?, ?, ?)")
      .run(name, label, type || 'text');
    res.json({ success: true });
  } catch (e) {
    res.status(400).json({ error: "Attribute name must be unique" });
  }
});

router.delete("/attributes/:id", (req, res) => {
  db.prepare("DELETE FROM attribute_definitions WHERE id = ?").run(req.params.id);
  res.json({ success: true });
});

// Stats
router.get("/dashboard/stats", (req, res) => {
  const invoices = db.prepare("SELECT SUM(total_amount) as total FROM invoices WHERE status = 'paid'").get() as any;
  const contracts = db.prepare("SELECT COUNT(*) as count FROM contracts WHERE status = 'active'").get() as any;
  const stockAlerts = db.prepare("SELECT COUNT(*) as count FROM products WHERE stock_quantity < 10").get() as any;
  const transactions = db.prepare("SELECT SUM(amount) as total FROM transactions WHERE type = 'in'").get() as any;

  res.json({
    revenue: (invoices.total || 0) + (transactions.total || 0),
    activeContracts: contracts.count,
    stockAlerts: stockAlerts.count
  });
});

router.get("/finance/dre", (req, res) => {
  res.json({
    grossRevenue: 85000,
    taxes: 12000,
    netRevenue: 73000,
    cogs: 28000,
    grossProfit: 45000,
    operatingExpenses: 18000,
    ebitda: 27000,
    netProfit: 21600
  });
});

router.get("/users", (req, res) => {
  const users = db.prepare(`SELECT * FROM users`).all() as any[];
  const userRoles = users.map(u => ({
    id: u.id,
    username: u.username,
    role: u.role,
    permissions: JSON.parse(u.permissions || '["dashboard"]')
  }));
  res.json(userRoles);
});

router.post("/users", (req: CustomRequest, res: any) => {
  if (req.user?.role !== 'admin') return res.status(403).json({ error: "Forbidden" });
  const { username, password, role, permissions } = req.body;
  try {
    db.prepare("INSERT INTO users (username, password, role, permissions) VALUES (?, ?, ?, ?)")
      .run(username, password || 'Padrão123', role || 'user', JSON.stringify(permissions || ['dashboard']));
    res.json({ success: true });
  } catch (e) {
    res.status(400).json({ error: "Username must be unique" });
  }
});

router.put("/users/:id", (req: CustomRequest, res: any) => {
  if (req.user?.role !== 'admin') return res.status(403).json({ error: "Forbidden" });
  const { username, password, role, permissions } = req.body;
  try {
    if (password) {
      db.prepare("UPDATE users SET username=?, password=?, role=?, permissions=? WHERE id=?")
        .run(username, password, role, JSON.stringify(permissions), req.params.id);
    } else {
      db.prepare("UPDATE users SET username=?, role=?, permissions=? WHERE id=?")
        .run(username, role, JSON.stringify(permissions), req.params.id);
    }
    res.json({ success: true });
  } catch (e) {
    res.status(400).json({ error: "Error updating user" });
  }
});

router.delete("/users/:id", (req: CustomRequest, res: any) => {
  if (req.user?.role !== 'admin') return res.status(403).json({ error: "Forbidden" });
  if (req.params.id == req.user?.id) return res.status(400).json({ error: "Cannot delete yourself" });
  db.prepare("DELETE FROM users WHERE id = ?").run(req.params.id);
  res.json({ success: true });
});

export default router;
