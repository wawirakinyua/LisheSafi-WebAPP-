const mongoose = require('mongoose');

const foodSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a food name'],
      trim: true,
      unique: true,
    },
    category: {
      type: String,
      default: 'General',
    },
    // Standard baseline: All nutrients stored per 100g
    caloriesPer100g: {
      type: Number,
      required: true,
    },
    proteinPer100g: {
      type: Number,
      required: true,
    },
    carbsPer100g: {
      type: Number,
      required: true,
    },
    fatPer100g: {
      type: Number,
      required: true,
    },
    fiberPer100g: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Food', foodSchema);