const jwt = require("jsonwebtoken");
const User = require("../models/User");

const requireAuth = async (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({
      message: "Authentication is required.",
    });
  }

  try {
    const { userId } = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(userId);

    if (!user) {
      return res.status(401).json({
        message: "Authentication is required.",
      });
    }

    req.user = user;
    return next();
  } catch {
    return res.status(401).json({
      message: "Authentication is required.",
    });
  }
};

module.exports = requireAuth;