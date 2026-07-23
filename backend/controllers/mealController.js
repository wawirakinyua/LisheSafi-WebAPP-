const Meal = require('../models/Meal');
const Food = require('../models/Food');

// @desc    Log a new meal
// @route   POST /api/meals
// @access  Private
const logMeal = async (req, res) => {
  try {
    const { mealType, items } = req.body; // items: [{ foodId, portionInGrams }]

    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'Please add at least one food item' });
    }

    // Process items asynchronously and scale macros
    const processedItems = await Promise.all(
      items.map(async (item) => {
        const food = await Food.findById(item.foodId);
        if (!food) {
          throw new Error(`Food item with ID ${item.foodId} not found`);
        }

        const factor = item.portionInGrams / 100;

        return {
          food: food._id,
          foodName: food.name,
          portionInGrams: item.portionInGrams,
          calories: Math.round(food.caloriesPer100g * factor),
          protein: parseFloat((food.proteinPer100g * factor).toFixed(1)),
          carbs: parseFloat((food.carbsPer100g * factor).toFixed(1)),
          fat: parseFloat((food.fatPer100g * factor).toFixed(1)),
          fiber: parseFloat((food.fiberPer100g * factor).toFixed(1)),
        };
      })
    );

    const meal = await Meal.create({
      user: req.user._id,
      mealType,
      items: processedItems,
    });

    res.status(201).json(meal);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user's logged meals (optionally filter by ?date=YYYY-MM-DD)
// @route   GET /api/meals
// @access  Private
const getMeals = async (req, res) => {
  try {
    const { date } = req.query;
    let query = { user: req.user._id };

    if (date) {
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);

      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);

      query.createdAt = { $gte: startOfDay, $lte: endOfDay };
    }

    const meals = await Meal.find(query).sort({ createdAt: -1 });
    res.json(meals);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a meal entry
// @route   DELETE /api/meals/:id
// @access  Private
const deleteMeal = async (req, res) => {
  try {
    const meal = await Meal.findById(req.params.id);

    if (!meal) {
      return res.status(404).json({ message: 'Meal not found' });
    }

    if (meal.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    await meal.deleteOne();
    res.json({ message: 'Meal log removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { logMeal, getMeals, deleteMeal };