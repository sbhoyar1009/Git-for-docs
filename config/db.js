const mongoose = require("mongoose");
const {mainLogger} = require("../logger/logger");

const connectDB = async () => {
  try {
    await mongoose.connect("mongodb://localhost:27017/textEditorDB");
    mainLogger.info("Server connected to MongoDB successfully");
  } catch (err) {
    mainLogger.error("MongoDB connection failed:", err);
    process.exit(1);
  }
};

module.exports = connectDB;
