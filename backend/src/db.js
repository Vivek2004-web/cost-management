const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

const dataDir = path.join(__dirname, '../data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const dbPath = path.join(dataDir, 'cloud_monitor.db');
const db = new Database(dbPath);

// Enable WAL mode for high performance
db.pragma('journal_mode = WAL');

function initDatabase() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      full_name TEXT NOT NULL,
      aws_access_key TEXT DEFAULT '',
      aws_secret_key TEXT DEFAULT '',
      aws_region TEXT DEFAULT 'us-east-1',
      azure_client_id TEXT DEFAULT '',
      azure_tenant_id TEXT DEFAULT '',
      azure_secret TEXT DEFAULT '',
      gcp_project_id TEXT DEFAULT '',
      gcp_service_key TEXT DEFAULT '',
      demo_mode INTEGER DEFAULT 1,
      currency TEXT DEFAULT 'USD',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS cloud_credits (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      provider TEXT NOT NULL DEFAULT 'AWS', -- 'AWS', 'Azure', 'GCP', 'Overall'
      program_name TEXT NOT NULL DEFAULT 'AWS Activate / Startup Grant',
      total_granted REAL NOT NULL DEFAULT 10000.00,
      remaining_amount REAL NOT NULL DEFAULT 8450.00,
      expiration_date TEXT DEFAULT '2026-12-31',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS budgets (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      category TEXT NOT NULL DEFAULT 'Overall Multi-Cloud',
      monthly_limit REAL NOT NULL,
      alert_threshold INTEGER DEFAULT 80,
      period TEXT DEFAULT 'Monthly',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS alert_webhooks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      type TEXT NOT NULL,
      name TEXT NOT NULL,
      url_or_email TEXT NOT NULL,
      enabled INTEGER DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS optimization_checklist (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      task_name TEXT NOT NULL,
      category TEXT NOT NULL,
      estimated_savings REAL NOT NULL,
      impact TEXT DEFAULT 'HIGH',
      is_completed INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS audit_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      action TEXT NOT NULL,
      details TEXT,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Column migration checks
  const columns = db.prepare("PRAGMA table_info(users)").all().map(c => c.name);
  if (!columns.includes('azure_client_id')) db.exec("ALTER TABLE users ADD COLUMN azure_client_id TEXT DEFAULT ''");
  if (!columns.includes('azure_tenant_id')) db.exec("ALTER TABLE users ADD COLUMN azure_tenant_id TEXT DEFAULT ''");
  if (!columns.includes('azure_secret')) db.exec("ALTER TABLE users ADD COLUMN azure_secret TEXT DEFAULT ''");
  if (!columns.includes('gcp_project_id')) db.exec("ALTER TABLE users ADD COLUMN gcp_project_id TEXT DEFAULT ''");
  if (!columns.includes('gcp_service_key')) db.exec("ALTER TABLE users ADD COLUMN gcp_service_key TEXT DEFAULT ''");

  console.log('⚡ SQLite Database initialized successfully at:', dbPath);
}

initDatabase();

module.exports = db;
