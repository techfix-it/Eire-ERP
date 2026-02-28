import Database from "better-sqlite3";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new Database("techfix_v2.db");

export function initDb() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE,
      password TEXT,
      role TEXT,
      permissions TEXT
    );

    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      sku TEXT UNIQUE,
      brand TEXT,
      category TEXT,
      condition TEXT,
      description TEXT,
      attributes TEXT,
      images TEXT,
      price REAL,
      stock_quantity INTEGER,
      vat_rate REAL DEFAULT 23.0
    );

    CREATE TABLE IF NOT EXISTS invoices (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      customer_name TEXT,
      customer_email TEXT,
      issue_date DATETIME DEFAULT CURRENT_TIMESTAMP,
      total_amount REAL,
      vat_amount REAL,
      status TEXT DEFAULT 'pending'
    );

    CREATE TABLE IF NOT EXISTS service_orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      customer_name TEXT,
      description TEXT,
      status TEXT DEFAULT 'open',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS contracts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      customer_name TEXT,
      terms TEXT,
      start_date DATE,
      end_date DATE,
      status TEXT DEFAULT 'active'
    );

    CREATE TABLE IF NOT EXISTS vehicles (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      plate TEXT,
      driver_id INTEGER,
      status TEXT DEFAULT 'available',
      lat REAL,
      lng REAL
    );

    CREATE TABLE IF NOT EXISTS tasks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      type TEXT,
      description TEXT,
      address TEXT,
      lat REAL,
      lng REAL,
      duration INTEGER,
      status TEXT DEFAULT 'pending',
      vehicle_id INTEGER,
      priority INTEGER DEFAULT 0,
      order_index INTEGER DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      sender_id INTEGER,
      receiver_id INTEGER,
      content TEXT,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS transactions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      date TEXT,
      description TEXT,
      category TEXT,
      type TEXT,
      amount REAL,
      business_type TEXT
    );

    CREATE TABLE IF NOT EXISTS brands (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT UNIQUE,
      image_url TEXT,
      description TEXT
    );

    CREATE TABLE IF NOT EXISTS attribute_definitions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT UNIQUE,
      label TEXT,
      type TEXT DEFAULT 'text'
    );
  `);

  // Seeding from JSON files
  seedTable("users", "users.json", (data: any) => {
    const insert = db.prepare("INSERT OR IGNORE INTO users (username, password, role, permissions) VALUES (?, ?, ?, ?)");
    data.forEach((u: any) => insert.run(u.username, u.password, u.role, JSON.stringify(u.permissions)));
  });

  seedTable("attribute_definitions", "attributes.json", (data: any) => {
    const insert = db.prepare("INSERT OR IGNORE INTO attribute_definitions (name, label) VALUES (?, ?)");
    data.forEach((a: any) => insert.run(a.name, a.label));
  });

  seedTable("brands", "brands.json", (data: any) => {
    const insert = db.prepare("INSERT OR IGNORE INTO brands (name, image_url, description) VALUES (?, ?, ?)");
    data.forEach((b: any) => insert.run(b.name, b.image_url, b.description));
  });

  seedTable("products", "products.json", (data: any) => {
    const insert = db.prepare(`
      INSERT OR IGNORE INTO products (name, sku, brand, category, condition, description, attributes, images, price, stock_quantity, vat_rate)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    data.forEach((p: any) => {
      insert.run(
        p.name,
        p.sku,
        p.brand,
        p.category,
        p.condition || 'new',
        p.description,
        JSON.stringify(p.attributes),
        JSON.stringify(p.images),
        p.price,
        p.stock_quantity,
        23.0
      );
    });
  });

  seedTable("vehicles", "vehicles.json", (data: any) => {
    const insert = db.prepare("INSERT OR IGNORE INTO vehicles (name, plate, status, lat, lng) VALUES (?, ?, ?, ?, ?)");
    data.forEach((v: any) => insert.run(v.name, v.plate, v.status, v.lat, v.lng));
  });

  seedTable("tasks", "tasks.json", (data: any) => {
    const insert = db.prepare("INSERT OR IGNORE INTO tasks (type, description, address, lat, lng, duration) VALUES (?, ?, ?, ?, ?, ?)");
    data.forEach((t: any) => insert.run(t.type, t.description, t.address, t.lat, t.lng, t.duration));
  });

  seedTable("transactions", "transactions.json", (data: any) => {
    const insert = db.prepare("INSERT OR IGNORE INTO transactions (date, description, category, type, amount, business_type) VALUES (?, ?, ?, ?, ?, ?)");
    data.forEach((t: any) => insert.run(t.date, t.description, t.category, t.type, t.amount, t.business_type));
  });
}

function seedTable(tableName: string, fileName: string, seedFn: (data: any) => void) {
  const count = (db.prepare(`SELECT COUNT(*) as count FROM ${tableName}`).get() as any).count;
  if (count === 0) {
    const filePath = path.join(__dirname, "data", fileName);
    if (fs.existsSync(filePath)) {
      const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));
      seedFn(data);
      console.log(`Seeded ${tableName} from ${fileName}`);
    }
  }
}

export default db;
