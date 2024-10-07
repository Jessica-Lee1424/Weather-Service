import { Router } from 'express';
import HistoryService from './historyService';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const router = Router();

class WeatherService {
    private API_BASE_URL?:string;
    private API_Key?:string;

    constructor (apiBaseUrl: string, apiKey: string) {
        this.API_BASE_URL = process.env.API_BASE_URL || 'http://api.openweathermap.org/data/2.5/forecast';
        this.API_Key = process.env.API_KEY || '5a3350c48ffa0c4cb2151f7728e9e6b5';  // Set your API key
    }

    async getWeatherDataByCoords(lat: number, lon: number) {
        try {
            // Make an API call to get weather data using latitude and longitude
            const response = await axios.get(`${this.API_BASE_URL}forecast?lat=${lat}&lon=${lon}&appid=${this.API_Key}`);
            return response.data; // Return the fetched data
        } catch (error) {
            console.error('Error fetching weather data:', error);
            throw new Error('Weather data retrieval failed'); // Handle errors appropriately
        }
    }
}

// POST Request with latitude and longitude to retrieve weather data
router.post('/', async (req, res) => {
    const { lat, long } = req.body; // Change city to lat and long
    if (!lat || !long) {
        return res.status(400).json({ error: 'Latitude and longitude are required.' });
    }
    try {
        // Ensure you pass the correct arguments if required by the constructor
        const weatherServiceInstance = new WeatherService(); // Add arguments if needed

        const weatherData = await weatherServiceInstance.getWeatherDataByCoords(lat, long); // Ensure this method exists and returns a value
        await HistoryService.saveLocation(lat, long); // Pass lat and long as separate arguments
        return res.json(weatherData); // Add return here
    } catch (error) {
        return res.status(500).json({ error: 'Failed to retrieve weather data.' }); // Add return here
    }
});

// TODO: GET weather data from latitude and longitude
router.get('/:lat/:long', async (req, res) => {
    const { lat, long } = req.params; // Change city to lat and long
    try {
        const weatherServiceInstance = new WeatherService();

        const weatherData = await weatherServiceInstance.getWeatherDataByCoords(parseFloat(lat), parseFloat(long)); // Ensure this method exists
        res.json(weatherData);
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve weather data.' });
    }
});

// TODO: GET search history DONE
router.get('/history', async (_req, res) => {
    try {
        const history = await HistoryService.getHistory();
        res.json(history);
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve search history.' });
    }
});

// * BONUS TODO: DELETE location from search history
router.delete('/history/:id', async (_req, res) => {
    const { id } = _req.params;
    try {
        await HistoryService.deleteLocation(id); // Update to delete location from history using HistoryService
        res.status(204).send(); // No content
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete location from search history.' });
    }
});

export default router;