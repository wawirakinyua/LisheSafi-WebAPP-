const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Food = require('../models/Food');

dotenv.config({path: '../.env'});

const kenyanFoods = [
  {
    name: 'Ugali (White Maize Meal)',
    category: 'Cereals & Tubers',
    caloriesPer100g: 130,
    proteinPer100g: 2.7,
    carbsPer100g: 28.0,
    fatPer100g: 0.5,
    fiberPer100g: 1.2,
  },
  {
    name: 'Sukuma Wiki (Sautéed Kale)',
    category: 'Vegetables',
    caloriesPer100g: 49,
    proteinPer100g: 3.6,
    carbsPer100g: 8.0,
    fatPer100g: 1.2,
    fiberPer100g: 2.0,
  },
  {
    name: 'Githeri (Maize & Beans)',
    category: 'Pulses & Legumes',
    caloriesPer100g: 155,
    proteinPer100g: 6.5,
    carbsPer100g: 27.0,
    fatPer100g: 1.8,
    fiberPer100g: 6.0,
  },
  {
    name: 'Chapati (Wheat)',
    category: 'Cereals & Tubers',
    caloriesPer100g: 290,
    proteinPer100g: 7.5,
    carbsPer100g: 46.0,
    fatPer100g: 8.5,
    fiberPer100g: 2.2,
  },
  {
    name: 'Mukimo',
    category: 'Prepared Dishes',
    caloriesPer100g: 140,
    proteinPer100g: 4.0,
    carbsPer100g: 26.0,
    fatPer100g: 2.1,
    fiberPer100g: 3.5,
  },
  {
    name: 'Kienyeji Chicken Stew',
    category: 'Meat & Poultry',
    caloriesPer100g: 180,
    proteinPer100g: 18.0,
    carbsPer100g: 3.0,
    fatPer100g: 10.5,
    fiberPer100g: 0.5,
  },
  {
    name: 'Mandazi',
    category: 'Cereals & Tubers',
    caloriesPer100g: 340,
    proteinPer100g: 6.0,
    carbsPer100g: 50.0,
    fatPer100g: 13.0,
    fiberPer100g: 1.5,
  },
];

const seedFoods = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected for seeding local food database...');

    await Food.deleteMany(); 
    await Food.insertMany(kenyanFoods);
    console.log('✅ Local food database seeded successfully!');
    process.exit();
  } catch (error) {
    console.error(`❌ Error seeding database: ${error.message}`);
    process.exit(1);
  }
};

seedFoods();