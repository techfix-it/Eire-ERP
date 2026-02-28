import Database from "better-sqlite3";
import fs from "fs";

const db = new Database("techfix_v2.db");

// Clear users
db.prepare("DELETE FROM users").run();

// Seed users again
const data = JSON.parse(fs.readFileSync("server/data/users.json", "utf-8"));
const insert = db.prepare("INSERT INTO users (username, password, role, permissions) VALUES (?, ?, ?, ?)");
data.forEach((u: any) => insert.run(u.username, u.password, u.role, JSON.stringify(u.permissions)));

console.log("Users re-seeded successfully.");
