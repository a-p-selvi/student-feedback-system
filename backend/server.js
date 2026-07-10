const express = require("express");
const session = require("express-session");
const path = require("path");
const db = require("./config/db");
require("dotenv").config({ path: "../.env" });

const authRoutes = require("./routes/authRoutes");

const app = express();

// ================= MIDDLEWARE =================
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
    session({
        secret: process.env.SESSION_SECRET || "student-feedback-secret",
        resave: false,
        saveUninitialized: false,
    })
);

// ================= ENV LOG =================
console.log("EMAIL_USER:", process.env.EMAIL_USER);
console.log("EMAIL_PASS:", process.env.EMAIL_PASS ? "Loaded" : "Not Loaded");

// ================= ROUTES =================
app.use("/api/auth", authRoutes);

// ================= FEEDBACK API =================
app.post("/api/feedback", (req, res) => {
    const {
        fullName,
        email,
        registerNumber,
        department,
        year,
        gender,
        phone,
        address,
        feedback
    } = req.body;

    const sql = `
        INSERT INTO students 
        (fullName, email, registerNumber, department, year, gender, phone, address, feedback)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
        fullName,
        email,
        registerNumber,
        department,
        year,
        gender,
        phone,
        address,
        feedback
    ];

    db.run(sql, values, function (err) {
        if (err) {
            console.log("DB ERROR:", err.message);
            return res.status(500).json({ error: err.message });
        }

        res.json({
            message: "Saved Successfully",
            id: this.lastID
        });
    });
});

// ================= GET STUDENTS =================
app.get("/api/students", (req, res) => {
    db.all("SELECT * FROM students", [], (err, rows) => {
        if (err) {
            console.log("DB ERROR:", err.message);
            return res.status(500).json({ error: err.message });
        }

        res.json(rows);
    });
});

// ================= STATIC FRONTEND =================
app.use(express.static(path.join(__dirname, "../frontend")));

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/login.html"));
});

// ================= SERVER START =================
const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Server Running on http://localhost:${PORT}`);
});