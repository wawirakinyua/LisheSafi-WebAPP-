const express = require('express');
const router = express.Router();
const { logMeal, getMeals, deleteMeal } = require('../controllers/mealController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
  .post(protect, logMeal)
  .get(protect, getMeals);

router.route('/:id')
  .delete(protect, deleteMeal);

module.exports = router;