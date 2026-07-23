const express = require('express');
const router = express.Router();
const { searchFoods, calculatePortion } = require('../controllers/foodController');
const { protect } = require('../middleware/authMiddleware');

// All food routes are protected with JWT auth
router.get('/search', protect, searchFoods);
router.post('/calculate', protect, calculatePortion);

module.exports = router;