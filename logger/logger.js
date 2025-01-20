const { createLogger, format, transports } = require("winston");
const path = require("path");
const fs = require("fs");

// Ensure the logs directory exists
const logsDir = path.join(__dirname, "user_logs");
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir);
}

// Base log format
const logFormat = format.combine(
  format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  format.printf(({ timestamp, level, message, userId, ...meta }) => {
    const metaString = Object.keys(meta).length ? JSON.stringify(meta) : "";
    return `${timestamp} [${level.toUpperCase()}] [UserId: ${
      userId || "GLOBAL"
    }]: ${message} ${metaString}`;
  })
);

// Create a function to dynamically create user-specific loggers
const createUserLogger = (userId) => {
  const userLogPath = path.join(logsDir, `${userId}.log`);

  return createLogger({
    level: "info",
    format: logFormat,
    transports: [
      new transports.File({ filename: userLogPath }), // User-specific file
      new transports.Console(), // Optionally log to console for debugging
    ],
  });
};

// Global logger for generic logs
const mainLogger = createLogger({
  level: "info",
  format: logFormat,
  transports: [
    new transports.Console(),
    new transports.File({ filename: path.join(logsDir, "global.log") }),
  ],
});

module.exports = { createUserLogger, mainLogger };
