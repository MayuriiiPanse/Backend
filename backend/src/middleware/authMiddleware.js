// // src/middleware/authMiddleware.js
// const jwt = require('jsonwebtoken');

// exports.requireAuth = (req, res, next) => {
//   const token = (req.headers.authorization || '').replace('Bearer ', '');
//   if (!token) return res.status(401).json({ error: 'Unauthorized' });
//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     req.user = decoded; // {_id, username, role}
//     next();
//   } catch {
//     return res.status(401).json({ error: 'Invalid token' });
//   }
// };

// exports.requireRole = (...roles) => (req, res, next) => {
//   if (!roles.includes(req.user.role)) return res.status(403).json({ error: 'Forbidden' });
//   next();
// };


const jwt = require("jsonwebtoken");
const User = require("../models/user");

exports.auth = async (req, res, next) => {
  const auth = req.headers.authorization || "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7) : null;
  if (!token) return res.status(401).json({ error: "Unauthorized" });
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(payload.id).select("_id username email role");
    if (!user) return res.status(401).json({ error: "Unauthorized" });
    req.user = user;
    next();
  } catch {
    res.status(401).json({ error: "Unauthorized" });
  }
};
