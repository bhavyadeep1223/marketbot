const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./market.db');

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS searches (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      symbol TEXT,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
});

module.exports = db;