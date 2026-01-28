const sqlite3 = require("sqlite3").verbose();

// create / connect DB file
const db = new sqlite3.Database("./skills.db", (err) => {
  if (err) {
    console.error("❌ DB connection error", err.message);
  } else {
    console.log("✅ Connected to SQLite database");
  }
});

// create table if not exists
db.run(`
  CREATE TABLE IF NOT EXISTS skills (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    teach TEXT,
    learn TEXT,
    level TEXT,
    contact TEXT
  )
`);

module.exports = db;
