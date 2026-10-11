const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Server port
const PORT = process.env.PORT || 5000;

// Basic homepage route
app.get("/", (req, res) => {
res.send("Welcome to the Campus SOS Backend!");
});

// Health-check route
app.get("/api/health", (req, res) => {
res.json({
success: true,
message: "Campus SOS backend is running successfully!"
});
});

// Start the server
app.listen(PORT, () => {
console.log(`Campus SOS server running at http://localhost:${PORT}`);
});
