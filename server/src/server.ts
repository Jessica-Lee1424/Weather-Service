import dotenv from 'dotenv';
import express from 'express';
import path from 'path';

// Load environment variables from .env file
dotenv.config();

// Import the routes
import routes from './routes/index.js';

const app = express();

// Serve static files from the 'public' directory
app.use(express.static('public'));

// Middleware to parse JSON bodies
app.use(express.json());

// Example middleware function
const myMiddleware = (req: any, res: any, next: any) => {
    // Middleware logic (e.g., logging, authentication, etc.)
    console.log(`Request Method: ${req.method}, Request URL: ${req.url}`);
    
    // Call next() to pass control to the next middleware or route handler
    next();
};

// Use the custom middleware
app.use(myMiddleware);

// Use the imported routes
app.use('/', routes); // You can change the path as necessary

// Serve the main HTML file
app.get('/', (_req, res) => {
    res.sendFile(path.join(__dirname, '../public', 'index.html'));
});

const PORT = process.env.PORT || 3000;

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});