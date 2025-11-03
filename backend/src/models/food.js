// // src/models/food.js
// const mongoose = require('mongoose');

// const foodSchema = new mongoose.Schema({
//   title: { type: String, required: true, trim: true },
//   description: { type: String, trim: true },
//   location: {
//     address: { type: String, required: true },
//     geo: {
//       type: { type: String, enum: ['Point'], default: 'Point' },
//       coordinates: { type: [Number], default: [0, 0] } // [lng, lat]
//     }
//   },
//   donor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
//   donorName: { type: String }, // keep for convenience/display
//   imageUrl: { type: String },
//   status: { type: String, enum: ['available', 'reserved', 'picked'], default: 'available' },
//   reservedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
//   expiresAt: { type: Date }, // optional TTL-like logic
//   isDeleted: { type: Boolean, default: false }
// }, { timestamps: true });

// foodSchema.index({ 'location.geo': '2dsphere' });

// module.exports = mongoose.model('Food', foodSchema);

const { Schema, model, Types } = require("mongoose");

const FoodSchema = new Schema(
  {
    donor: { type: Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    description: { type: String, default: "" },
    image: { type: String, default: "" },
    location: {
      address: { type: String, default: "" }
    },
    status: { type: String, enum: ["Available", "Accepted", "Completed"], default: "Available" },
    expiresAt: { type: Date }
  },
  { timestamps: true }
);

module.exports = model("Food", FoodSchema);
