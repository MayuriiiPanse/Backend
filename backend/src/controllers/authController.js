const jwt = require("jsonwebtoken");
const User = require("../models/user");

const sign = (user) =>
  jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "7d" });

exports.register = async (req, res) => {
  const { username, email, password, role } = req.body || {};
  if (!username || !email || !password || !role)
    return res.status(400).json({ error: "Missing fields" });
  const exists = await User.findOne({ email });
  if (exists) return res.status(409).json({ error: "Email already used" });
  const user = await User.create({ username, email, password, role });
  const token = sign(user);
  res.json({ user: { _id: user._id, username, email, role }, token });
};

exports.login = async (req, res) => {
  const { email, password } = req.body || {};
  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ error: "Invalid credentials" });
  const ok = await user.compare(password);
  if (!ok) return res.status(400).json({ error: "Invalid credentials" });
  const token = sign(user);
  res.json({ user: { _id: user._id, username: user.username, email, role: user.role }, token });
};
