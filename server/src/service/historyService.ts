import fs from 'fs/promises';
import path from 'node:path';

class City {
    name: string; // The name of the city
    id: any; // A unique identifier for the city
    lat: number; // Latitude of the city
    lon: number; // Longitude of the city

    constructor(name: string, id: any, lat: number, lon: number) {
        this.name = name;
        this.id = id;
        this.lat = lat;
        this.lon = lon;
    }
}

// export default City;

class HistoryService {
    historyFilePath;

    constructor() {
        this.historyFilePath = path.join(__dirname, 'searchHistory.json'); // Path to your history file
    }

    // Method to save a location to the search history
    async saveLocation(lat:number, lon:number) {
        const history = await this.getHistory();
        const locationId = history.length ? history[history.length - 1].id + 1 : 1; // Simple ID generation
        const locationName = `City at lat: ${lat}, lon: ${lon}`; // Create a name for the city
        const location = new City(locationName, locationId, lat, lon); // Create a City instance with name, id, lat, and lon
        history.push(location);
        await this.saveHistory(history);
    }
    
    // Method to retrieve the search history
    async getHistory() {
        try {
            const data = await fs.readFile(this.historyFilePath, 'utf-8');
            return JSON.parse(data);
        } catch (error) {
            return []; // Return an empty array if the file doesn't exist or can't be read
        }
    }

    // Method to save the updated history back to the file
    async saveHistory(history:string) {
        await fs.writeFile(this.historyFilePath, JSON.stringify(history, null, 2));
    }

    // Method to delete a location from search history by ID
    async deleteLocation(id:string) {
        const history = await this.getHistory();
        const updatedHistory = history.filter((location: { id: number; }) => location.id !== parseInt(id));
        
        if (updatedHistory.length === history.length) {
            // If the length is the same, it means the location with the given ID was not found
            return false; // Indicate that the deletion was unsuccessful
        }

        await this.saveHistory(updatedHistory);
        return true; // Indicate that the deletion was successful
    }

    // Method to read from the searchHistory.json file
    async read() {
        return await this.getHistory(); // Reuse getHistory for reading
    }

    // Method to write the updated locations array to the searchHistory.json file
    async write(locations: string) {
        await this.saveHistory(locations); // Reuse saveHistory for writing
    }

    // Method to get locations from the searchHistory.json file and return them as an array of Location objects
    async getLocations() {
        const locationsData = await this.read();
        return locationsData; // No need to convert since we are already working with Location objects
    }

    // Method to add a location to the searchHistory.json file
    async addLocation(lat: any, lon: any) {
        const locations = await this.getLocations();
        const locationId = locations.length ? locations[locations.length - 1].id + 1 : 1; // Simple ID generation
        const newLocation = new City(`City at lat: ${lat}, lon: ${lon}`, locationId, lat, lon); // Create a new City instance with lat and lon
        locations.push(newLocation);
        await this.saveHistory(locations); // Save the updated locations
    }
}

export default new HistoryService();