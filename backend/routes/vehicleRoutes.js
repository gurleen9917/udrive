import express from 'express';
import { getVehicles, addVehicle } from '../controllers/vehicleController.js';

const router = express.Router();

// GET request to /api/vehicles
router.get('/', getVehicles);

// POST request to /api/vehicles
router.post('/', addVehicle);

export default router;