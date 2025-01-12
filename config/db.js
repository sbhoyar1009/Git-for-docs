const mongoose = require("mongoose");
const logger = require("../logger/logger");

const connectDB = async () => {
  try {
    await mongoose.connect("mongodb://localhost:27017/textEditorDB", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    logger.info("Server connected to MongoDB successfully");
  } catch (err) {
    logger.error("MongoDB connection failed:", err);
    process.exit(1);
  }
};

module.exports = connectDB;
