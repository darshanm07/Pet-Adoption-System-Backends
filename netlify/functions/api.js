const serverless = require("serverless-http");
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

const connectDB = require("../../config/db");
const authRoutes = require("../../routes/authRoutes");
const petRoutes = require("../../routes/petRoutes");
const applicationRoutes = require("../../routes/applicationRoutes");

dotenv.config();

const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  "https://your-frontend.netlify.app",
];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* DB connection */
connectDB();

/* Routes */
app.use("/api/auth", authRoutes);
app.use("/api/pets", petRoutes);
app.use("/api/applications", applicationRoutes);

app.get("/api/health", (req, res) => {
  res.json({ status: "OK", message: "Server is running" });
});

module.exports.handler = serverless(app);
