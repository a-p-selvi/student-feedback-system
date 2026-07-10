const sqlite3 = require("sqlite3").verbose();
const path = require("path");

// ================= DATABASE PATH =================

const dbPath = path.join(__dirname, "../student.db");

// ================= CONNECT DB =================

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.log("❌ SQLite Connection Error:", err.message);
    } else {
        console.log("✅ SQLite Connected");
    }
});

// ================= CREATE TABLE =================

db.serialize(() => {
    db.run(
        `
        CREATE TABLE IF NOT EXISTS students (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            fullName TEXT NOT NULL,
            email TEXT,
            registerNumber TEXT,
            department TEXT,
            year TEXT,
            gender TEXT,
            phone TEXT,
            address TEXT,
            feedback TEXT,
            createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
        )
        `,
        (err) => {
            if (err) {
                console.log("❌ Table Create Error:", err.message);
            } else {
                console.log("✅ Students Table Ready");
            }
        }
    );
});

module.exports = db;