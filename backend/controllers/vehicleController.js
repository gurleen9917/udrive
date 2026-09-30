import Vehicle from '../models/Vehicle.js';

// Fetch all vehicles
export const getVehicles = async (req, res) => {
  try {
    const vehicles = await Vehicle.find(); // Fetches everything from the database
    res.status(200).json(vehicles);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch vehicles', error: error.message });
  }
};

// Add a new vehicle
export const addVehicle = async (req, res) => {
  try {
    const { make, model, category, dailyRate, imageUrl } = req.body;
    
    const newVehicle = new Vehicle({
      make,
      model,
      category,
      dailyRate,
      imageUrl
    });

    await newVehicle.save(); // Inserts the new record
    res.status(201).json(newVehicle);
  } catch (error) {
    res.status(500).json({ message: 'Failed to add vehicle', error: error.message });
  }
};