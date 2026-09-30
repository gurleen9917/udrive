import Booking from '../models/Booking.js';
import Vehicle from '../models/Vehicle.js';

export const createBooking = async (req, res) => {
  try {
    const { vehicleId, startDate, endDate } = req.body;

    // 1. Fetch the vehicle to get the daily rate
    const vehicle = await Vehicle.findById(vehicleId);
    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }

    // 2. Calculate the total number of days
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
    
    // 3. Calculate total price
    const totalPrice = diffDays * vehicle.dailyRate;

    // 4. Create the booking record 
    // (Using a dummy 24-character User ID until we build the Login system)
    const newBooking = new Booking({
      user: '111111111111111111111111', 
      vehicle: vehicleId,
      startDate,
      endDate,
      totalPrice
    });

    await newBooking.save();
    res.status(201).json(newBooking);
  } catch (error) {
    res.status(500).json({ message: 'Booking failed', error: error.message });
  }
};