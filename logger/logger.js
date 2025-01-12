const { createLogger, format, transports } = require('winston');

// Define log formats
const logFormat = format.combine(
  format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), // Add a timestamp
  format.printf(({ timestamp, level, message, stack }) => {
    return `${timestamp} [${level.toUpperCase()}]: ${stack || message}`;
  })
);

// Create the logger instance
const logger = createLogger({
  level: 'info', // Default log level
  format: logFormat,
  transports: [
    new transports.Console(), // Logs to console
    new transports.File({ filename: 'logs/error.log', level: 'error' }), // Logs errors to a file
    new transports.File({ filename: 'logs/combined.log' }) // Logs all messages to a file
  ],
  exceptionHandlers: [
    new transports.File({ filename: 'logs/exceptions.log' }) // Capture uncaught exceptions
  ],
  rejectionHandlers: [
    new transports.File({ filename: 'logs/rejections.log' }) // Capture unhandled rejections
  ]
});

module.exports = logger;
