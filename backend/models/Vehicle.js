import mongoose from 'mongoose';

const vehicleSchema = new mongoose.Schema(
  {
    make: { type: String, required: true }, // e.g., Toyota
    model: { type: String, required: true }, // e.g., Camry
    category: { type: String, required: true }, // e.g., SUV, Sedan
    dailyRate: { type: Number, required: true }, // e.g., 50
    isAvailable: { type: Boolean, default: true },
    imageUrl: { type: String } // Link to a picture of the car
  },
  { timestamps: true }
);

export default mongoose.model('Vehicle', vehicleSchema);