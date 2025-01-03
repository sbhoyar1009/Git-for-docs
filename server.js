const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const textRoutes = require("./routes/text");
const userRoutes = require("./routes/user");
const versionRoutes = require("./routes/version");
const { fetchDocumentStatistics } = require("./controllers/textController");
const { protect } = require("./middleware/auth");
const dotenv = require("dotenv");
dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Database connection
connectDB();

// Routes
app.use("/api/user", userRoutes);
app.use("/api/text",protect, textRoutes);
app.use("/api/version", protect,versionRoutes);
// Start the server

app.listen(5001, () => {
  console.log("Server is running on http://localhost:5001");
});
