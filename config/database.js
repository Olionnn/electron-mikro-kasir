// db.js (ESM)
import { Sequelize } from "sequelize";
import fs from "fs";
import path from "path";
import { getDatabasePath, getDataDirectory, getLogsDirectory } from "./paths.js";
import { registerManualTimestamps } from "../backend/helpers/timestamps.js";

const dbPath = getDatabasePath();
const dataDir = getDataDirectory();
const logsDir = getLogsDirectory();

for (const dir of [dataDir, logsDir]) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log("📁 Created directory:", dir);
  }
}

// Pastikan file DB ada (mode append aman; bikin kalau belum ada)
try {
  const parent = path.dirname(dbPath);
  if (!fs.existsSync(parent)) fs.mkdirSync(parent, { recursive: true });
  const fd = fs.openSync(dbPath, "a"); // create if not exists
  fs.closeSync(fd);
  console.log("✅ Ensured database file exists:", dbPath);
} catch (e) {
  console.error("❌ Failed ensuring DB file:", e);
}

const isDevelopment = process.env.NODE_ENV !== "production";

const db = new Sequelize({
  dialect: "sqlite",
  storage: dbPath,
  logging: isDevelopment ? (msg) => console.log("🔍 SQL:", msg) : false,
  pool: { max: 5, min: 0, acquire: 30000, idle: 10000 },
  retry: { max: 3 },
  dialectOptions: {
    // foreignKeys PRAGMA akan di-set manual di bawah
    // timezone is not supported for SQLite
  },
  define: {
    freezeTableName: true, // pakai nama tabel apa adanya
    underscored: false,
  },
  quoteIdentifiers: true,
  // timezone is not supported for SQLite
});

registerManualTimestamps(db, {
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

export async function initDatabase() {
  try {
    await db.authenticate();
    console.log("✅ DB connection ok.");

    // Set PRAGMA yang sehat untuk Electron app
    await db.query("PRAGMA foreign_keys = ON;");
    await db.query("PRAGMA journal_mode = WAL;");       // concurrency lebih baik
    await db.query("PRAGMA synchronous = NORMAL;");      // speed vs safety balance
    await db.query("PRAGMA temp_store = MEMORY;");       // in-memory temp

    return db;
  } catch (error) {
    console.error("❌ Unable to init database:", error);
    throw error;
  }
}

export default db;