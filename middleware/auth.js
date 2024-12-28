const jwt = require("jsonwebtoken");

const protect = (req, res, next) => {
  console.log("Protect is called")
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
      console.log(token)
      next();
    } catch (error) {
      return res.status(401).json({ message: "Not authorized, token failed" });
    }
  }

  if (!token) {
    console.log("No token")
    return res.status(401).json({ message: "Not authorized, no token" });
  }
};

module.exports = { protect };
