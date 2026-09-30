import express from 'express';
import { createBooking } from '../controllers/bookingController.js';
import Booking from '../models/Booking.js';

const router = express.Router();

// POST route to create a booking
router.post('/', createBooking);

// GET route to fetch all bookings with populated vehicle details
router.get('/', async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate('vehicle', 'make model dailyRate category')
      .sort({ createdAt: -1 });
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching bookings', error: error.message });
  }
});

// DELETE route to cancel/remove a reservation (Place it right here!)
router.delete('/:id', async (req, res) => {
  try {
    await Booking.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Booking cancelled successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting booking', error: error.message });
  }
});

export default router;