
const jwt = require("jsonwebtoken");

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    // token missing
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    // extract token
    const token = authHeader.split(" ")[1];

    // verify token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    // attach user
    req.user = decoded;

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid token",
    });
  }
};

module.exports = authMiddleware;