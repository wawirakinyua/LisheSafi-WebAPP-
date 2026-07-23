const mongoose = require('mongoose');

// Embedded sub-schema for individual food items inside a meal entry
const mealItemSchema = new mongoose.Schema({
  food: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Food',
    required: true,
  },
  foodName: {
    type: String,
    required: true,
  },
  portionInGrams: {
    type: Number,
    required: true,
  },
  calories: {
    type: Number,
    required: true,
  },
  protein: {
    type: Number,
    required: true,
  },
  carbs: {
    type: Number,
    required: true,
  },
  fat: {
    type: Number,
    required: true,
  },
  fiber: {
    type: Number,
    default: 0,
  },
});

// Parent schema for full meal logs
const mealSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    mealType: {
      type: String,
      enum: ['Breakfast', 'Lunch', 'Dinner', 'Snack'],
      required: [true, 'Please specify meal type'],
    },
    items: [mealItemSchema],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Meal', mealSchema);