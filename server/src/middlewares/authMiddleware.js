const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  // Get the token from the Authorization header
  const token = req.header("Authorization");

  // If no token is provided
  if (!token) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  try {
    // Remove 'Bearer ' prefix from the token
    const tokenWithoutBearer = token.split(" ")[1];
    
    // Verify the token using JWT secret from the environment
    jwt.verify(tokenWithoutBearer, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: "Token is not valid" });
      }

      // Attach decoded data to request (user data)
      req.user = decoded;

      // If token is valid, proceed to the next middleware or route handler
      next();
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Server Error" });
  }
};

const verifyAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: "Access denied: Admins only" });
  }
  next();
};

module.exports = {
  verifyToken,
  verifyAdmin
};