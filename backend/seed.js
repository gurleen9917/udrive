import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Vehicle from './models/Vehicle.js';

dotenv.config();

const sampleVehicles = [
  // Sedans
  { make: 'Toyota', model: 'Camry', category: 'Sedan', dailyRate: 45, imageUrl: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?auto=format&fit=crop&w=800&q=80' },
  { make: 'Honda', model: 'Accord', category: 'Sedan', dailyRate: 50, imageUrl: 'https://images.unsplash.com/photo-1590362891991-f776e747a588?auto=format&fit=crop&w=800&q=80' },
  { make: 'Hyundai', model: 'Elantra', category: 'Sedan', dailyRate: 40, imageUrl: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=800&q=80' },

  // SUVs
  { make: 'Honda', model: 'CR-V', category: 'SUV', dailyRate: 65, imageUrl: 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=800&q=80' },
  { make: 'Ford', model: 'Explorer', category: 'SUV', dailyRate: 75, imageUrl: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=800&q=80' },
  { make: 'Jeep', model: 'Wrangler', category: 'SUV', dailyRate: 85, imageUrl: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80' },

  // Luxury
  { make: 'Tesla', model: 'Model 3', category: 'Luxury', dailyRate: 95, imageUrl: 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=800&q=80' },
  { make: 'BMW', model: 'M4 Series', category: 'Luxury', dailyRate: 150, imageUrl: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=800&q=80' },

  // Bikes
  { make: 'Yamaha', model: 'YZF-R3', category: 'Bike', dailyRate: 35, imageUrl: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=800&q=80' },
  { make: 'Harley-Davidson', model: 'Iron 883', category: 'Bike', dailyRate: 55, imageUrl: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=800&q=80' }
];

const seedDB = async () => {
  try {
    // Connect to the database
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected for seeding...');

    // Clear any existing vehicles to avoid duplicates
    await Vehicle.deleteMany();
    
    // Insert the new test data
    await Vehicle.insertMany(sampleVehicles);
    console.log('Vehicles successfully added to the database!');

    // Exit the script
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

seedDB();