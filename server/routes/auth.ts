import { Router } from "express";
import db from "../db.js";

const router = Router();

router.post("/login", (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ error: "Username and password are required" });
    }

    const user = db.prepare("SELECT * FROM users WHERE username = ? AND password = ?").get(username.trim(), password.trim()) as any;
    
    if (user) {
      res.json({ 
        id: user.id, 
        username: user.username, 
        role: user.role, 
        permissions: JSON.parse(user.permissions) 
      });
    } else {
      res.status(401).json({ error: "Invalid username or password" });
    }
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/me", (req: any, res) => {
  const token = req.headers.authorization;
  if (!token) return res.status(401).json({ error: "Unauthorized" });
  
  const user = db.prepare("SELECT * FROM users WHERE id = ?").get(token) as any;
  if (!user) return res.status(401).json({ error: "Unauthorized" });

  res.json({ 
    id: user.id, 
    username: user.username, 
    role: user.role, 
    permissions: JSON.parse(user.permissions) 
  });
});

export default router;
