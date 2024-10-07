import { Router } from 'express';
const router = Router();

import weatherRoutes from './weatherRoutes'; // Make sure this imports the router correctly

// Use the weather routes for any requests to /weather
router.use('/weather', weatherRoutes);

// You can add more routes here for other services if needed
// router.use('/anotherService', anotherRoutes);

export default router;