const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const textRoutes = require("./routes/text");
const userRoutes = require("./routes/user");
const versionRoutes = require("./routes/version");
const paymentRoutes = require("./routes/payment");
const { protect } = require("./middleware/auth");
const dotenv = require("dotenv");
dotenv.config();
const app = express();
const {mainLogger} = require("./logger/logger");
// Middleware
app.use(cors());
app.use(express.json());

// Database connection
connectDB();

// Routes
app.use("/api/user", userRoutes);
app.use("/api/text", protect, textRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/version", protect, versionRoutes);
// Start the server

app.listen(5001, () => {
  mainLogger.info("Server is running on http://localhost:5001");
});
