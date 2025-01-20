const jwt = require("jsonwebtoken");
const {mainLogger} = require("../logger/logger");

const protect = (req, res, next) => {
  mainLogger.info("Protect middleware called", {
    method: req.method,
    url: req.url,
    timestamp: new Date(),
  });

  let token;

  // Check if token is provided in headers
  if (
    req.headers.authorization && 
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded; // Attach decoded token payload to the request

      mainLogger.info("Token verified successfully", {
        message: "JWT token verified",
        token,
        userId: decoded.id,
        timestamp: new Date(),
      });

      next();
    } catch (error) {
      mainLogger.error("Token verification failed", {
        error: error.message,
        token,
        timestamp: new Date(),
      });
      return res.status(401).json({ message: "Not authorized, token failed" });
    }
  }

  if (!token) {
    mainLogger.warn("No token provided", {
      message: "No token in request headers",
      method: req.method,
      url: req.url,
      timestamp: new Date(),
    });
    return res.status(401).json({ message: "Not authorized, no token" });
  }
};

module.exports = { protect };

module.exports = { protect };
