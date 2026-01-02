const express = require("express");
const cors = require("cors");
const serverless = require("serverless-http");
const dotenv = require("dotenv");

const connectDB = require("../../config/db");
const authRoutes = require("../../routes/authRoutes");
const petRoutes = require("../../routes/petRoutes");
const applicationRoutes = require("../../routes/applicationRoutes");

dotenv.config();
connectDB();

const app = express();

// ✅ CORS (VERY IMPORTANT)
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/auth", authRoutes);
app.use("/pets", petRoutes);
app.use("/applications", applicationRoutes);

// Health
app.get("/api/health", (req, res) => {
  res.json({ status: "OK", message: "Netlify backend running" });
});

module.exports.handler = serverless(app);
