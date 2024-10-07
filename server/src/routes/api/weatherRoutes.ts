import { Router } from 'express';
const router = Router();

import HistoryService from '../../service/historyService.js';
import WeatherService from '../../service/weatherService.js';

// POST Request with latitude and longitude to retrieve weather data
router.post('/', async (req: any, res: any, next:any) => {
    const { lat, long } = req.body; // Change city to lat and long
    if (!lat || !long) {
        return res.status(400).json({ error: 'Latitude and longitude are required.' });
    }
    try {
        // Make sure to pass the required arguments to the constructor
        const weatherServiceInstance = new WeatherService(process.env.API_KEY, 'https://api.weather.com');
        const weatherData = await weatherServiceInstance.getWeatherDataByCoords(lat, long); // Ensure this method exists
        await HistoryService.saveLocation(lat, long); // Pass lat and long as separate arguments
        return res.json(weatherData); // Ensure to return the response
    } catch (error) {
        // Pass the error to the next middleware (error handler)
        next(error); // This will invoke the error handling middleware
    }
});
router.get('/weather', async (_req, res, next) => {
    try {
        // Make sure to pass the required arguments to the constructor
        const weatherServiceInstance = new WeatherService(process.env.API_KEY, 'https://api.weather.com');

        const weatherData = await weatherServiceInstance.getWeatherDataByCoords(); // Ensure you pass the correct parameters
        res.json(weatherData);
    } catch (error) {
        // Pass the error to the next middleware (error handler)
        next(error); // This will invoke the error handling middleware
    }
});
// Other routes...

export default router; // Ensure you are exporting the router instance