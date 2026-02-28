import express from "express";
import { initDb } from "../server/db.js";
import authRoutes from "../server/routes/auth.js";
import inventoryRoutes from "../server/routes/inventory.js";
import commonRoutes from "../server/routes/common.js";

const app = express();

// Enable JSON bodies
app.use(express.json());

// Initialize DB (this will create an ephemeral DB in Vercel if not packaged)
try {
  initDb();
} catch (e) {
  console.error("Failed to initialize SQLite on Vercel", e);
}

// Prefixing is handled by Vercel routes or express, 
// using /api prefix directly to match our frontend calls
app.use("/api", authRoutes);
app.use("/api/inventory", inventoryRoutes);
app.use("/api", commonRoutes);

// Export for Vercel Serverless Functions
export default app;
