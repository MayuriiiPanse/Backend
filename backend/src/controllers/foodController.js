// // src/controllers/foodController.js
// const mongoose = require('mongoose');
// const Food = require('../models/food');

// const toObjectId = (id) => new mongoose.Types.ObjectId(id);

// exports.getAllFoods = async (req, res) => {
//   try {
//     const { page = 1, limit = 12, q = '', status = 'available', near, sort = '-createdAt' } = req.query;
//     const query = { isDeleted: false };
//     if (status) query.status = status;
//     if (q) query.title = { $regex: q, $options: 'i' };
//     if (near) {
//       const [lng, lat] = near.split(',').map(Number);
//       query['location.geo'] = { $near: { $geometry: { type: 'Point', coordinates: [lng, lat] }, $maxDistance: 10000 } };
//     }

//     const foods = await Food.find(query)
//       .sort(sort)
//       .skip((page - 1) * limit)
//       .limit(Number(limit))
//       .select('-__v');

//     const total = await Food.countDocuments(query);
//     res.json({ page: Number(page), limit: Number(limit), total, items: foods });
//   } catch (err) {
//     res.status(500).json({ error: 'Failed to fetch food items' });
//   }
// };

// exports.getFoodById = async (req, res) => {
//   try {
//     const food = await Food.findOne({ _id: req.params.id, isDeleted: false });
//     if (!food) return res.status(404).json({ error: 'Food not found' });
//     res.json(food);
//   } catch {
//     res.status(500).json({ error: 'Failed to fetch food item' });
//   }
// };

// exports.addFood = async (req, res) => {
//   try {
//     const imageUrl = req.file ? `/uploads/${req.file.filename}` : '';
//     const donor = req.user ? toObjectId(req.user._id) : null;
//     const donorName = req.user ? req.user.username : (req.body.donorName || 'Anonymous');

//     const newFood = await Food.create({
//       title: req.body.title,
//       description: req.body.description,
//       location: req.body.location,
//       donor,
//       donorName,
//       imageUrl,
//       expiresAt: req.body.expiresAt
//     });

//     req.io.emit('food:new', newFood); // broadcast
//     res.status(201).json(newFood);
//   } catch {
//     res.status(500).json({ error: 'Failed to add food item' });
//   }
// };

// exports.postFood = async (req, res) => {
//   try {
//     const imageUrl = req.file ? `/uploads/${req.file.filename}` : '';
//     const newFood = await Food.create({
//       title: req.body.title,
//       description: req.body.description,
//       location: req.body.location,
//       donor: toObjectId(req.user._id),
//       donorName: req.user.username,
//       imageUrl,
//       expiresAt: req.body.expiresAt
//     });

//     req.io.emit('food:new', newFood);
//     res.status(201).json({ message: 'Food posted successfully', food: newFood });
//   } catch {
//     res.status(500).json({ error: 'Failed to post food item' });
//   }
// };

// exports.updateFood = async (req, res) => {
//   try {
//     const food = await Food.findOne({ _id: req.params.id, isDeleted: false });
//     if (!food) return res.status(404).json({ error: 'Food not found' });
//     const isOwner = food.donor?.toString() === req.user._id || req.user.role === 'admin';
//     if (!isOwner) return res.status(403).json({ error: 'Not authorized to update this food' });

//     if (req.file) req.body.imageUrl = `/uploads/${req.file.filename}`;
//     Object.assign(food, req.body);
//     await food.save();

//     req.io.emit('food:update', food);
//     res.json({ message: 'Food updated successfully', food });
//   } catch {
//     res.status(500).json({ error: 'Failed to update food item' });
//   }
// };

// exports.deleteFood = async (req, res) => {
//   try {
//     const food = await Food.findOne({ _id: req.params.id, isDeleted: false });
//     if (!food) return res.status(404).json({ error: 'Food not found' });
//     const isOwner = food.donor?.toString() === req.user._id || req.user.role === 'admin';
//     if (!isOwner) return res.status(403).json({ error: 'Not authorized to delete this food' });

//     food.isDeleted = true; // soft delete
//     await food.save();

//     req.io.emit('food:delete', { id: food._id });
//     res.json({ message: 'Food deleted successfully' });
//   } catch {
//     res.status(500).json({ error: 'Failed to delete food item' });
//   }
// };

// // Reserve/claim and mark picked
// exports.reserveFood = async (req, res) => {
//   try {
//     const food = await Food.findOne({ _id: req.params.id, isDeleted: false, status: 'available' });
//     if (!food) return res.status(404).json({ error: 'Food not available' });

//     food.status = 'reserved';
//     food.reservedBy = toObjectId(req.user._id);
//     await food.save();

//     req.io.emit('food:reserved', { id: food._id, reservedBy: req.user._id });
//     res.json({ message: 'Reserved', food });
//   } catch {
//     res.status(500).json({ error: 'Failed to reserve' });
//   }
// };

// exports.markPicked = async (req, res) => {
//   try {
//     const food = await Food.findOne({ _id: req.params.id, isDeleted: false });
//     if (!food) return res.status(404).json({ error: 'Food not found' });
//     const isOwnerOrAdmin = food.donor?.toString() === req.user._id || req.user.role === 'admin';
//     if (!isOwnerOrAdmin) return res.status(403).json({ error: 'Not authorized' });

//     food.status = 'picked';
//     await food.save();

//     req.io.emit('food:picked', { id: food._id });
//     res.json({ message: 'Marked as picked', food });
//   } catch {
//     res.status(500).json({ error: 'Failed to update status' });
//   }
// };


const Food = require("../models/food");

exports.list = async (_req, res) => {
  const items = await Food.find().sort({ createdAt: -1 });
  res.json({ items });
};

exports.getOne = async (req, res) => {
  const item = await Food.findById(req.params.id);
  if (!item) return res.status(404).json({ error: "Not found" });
  res.json({ item });
};

exports.post = async (req, res) => {
  const b = req.body || {};
  const file = req.file;
  const food = await Food.create({
    donor: req.user._id,
    title: b.title,
    description: b.description || "",
    image: file ? `/uploads/${file.filename}` : "",
    location: { address: b["location[address]"] || b.address || "" },
    expiresAt: b.expiresAt ? new Date(b.expiresAt) : null
  });
  req.app.get("io").emit("food:new", { id: String(food._id), title: food.title, status: food.status });
  res.status(201).json({ food });
};

exports.update = async (req, res) => {
  const file = req.file;
  const update = {
    title: req.body.title,
    description: req.body.description,
    "location.address": req.body["location[address]"] || req.body.address
  };
  if (file) update.image = `/uploads/${file.filename}`;
  const food = await Food.findByIdAndUpdate(req.params.id, update, { new: true });
  if (!food) return res.status(404).json({ error: "Not found" });
  req.app.get("io").emit("food:update", { id: String(food._id), status: food.status, title: food.title });
  res.json({ food });
};

exports.remove = async (req, res) => {
  const f = await Food.findByIdAndDelete(req.params.id);
  if (!f) return res.status(404).json({ error: "Not found" });
  req.app.get("io").emit("food:delete", { id: String(f._id) });
  res.json({ ok: true });
};

exports.accept = async (req, res) => {
  const f = await Food.findByIdAndUpdate(
    req.params.id,
    { status: "Accepted" },
    { new: true }
  );
  if (!f) return res.status(404).json({ error: "Not found" });
  req.app.get("io").emit("food:update", { id: String(f._id), status: f.status });
  res.json({ food: f });
};
