const Food = require('../models/Food');

// @desc    Search local food database
// @route   GET /api/foods/search?q=ugali
// @access  Private
const searchFoods = async (req, res) => {
  try {
    const { q } = req.query;

    if (!q) {
      return res.status(400).json({ message: 'Search query is required' });
    }

    // Case-insensitive regex match
    const foods = await Food.find({
      name: { $regex: q, $options: 'i' },
    }).limit(10);

    res.json(foods);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Calculate macros for custom portion weight
// @route   POST /api/foods/calculate
// @access  Private
const calculatePortion = async (req, res) => {
  try {
    const { foodId, portionInGrams } = req.body;

    if (!foodId || !portionInGrams) {
      return res.status(400).json({ message: 'foodId and portionInGrams are required' });
    }

    const food = await Food.findById(foodId);
    if (!food) {
      return res.status(404).json({ message: 'Food item not found' });
    }

    const factor = portionInGrams / 100;

    const calculatedNutrients = {
      foodId: food._id,
      name: food.name,
      portionInGrams: Number(portionInGrams),
      calories: Math.round(food.caloriesPer100g * factor),
      protein: parseFloat((food.proteinPer100g * factor).toFixed(1)),
      carbs: parseFloat((food.carbsPer100g * factor).toFixed(1)),
      fat: parseFloat((food.fatPer100g * factor).toFixed(1)),
      fiber: parseFloat((food.fiberPer100g * factor).toFixed(1)),
    };

    res.json(calculatedNutrients);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { searchFoods, calculatePortion };