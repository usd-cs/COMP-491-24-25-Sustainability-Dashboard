import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';

import authRoutes from './auth/routes.js';
import tableRoutes from './tables/table_routes.js';
import dotenv from 'dotenv';
dotenv.config();

/**
 * @file mainServer.js
 * @description This script sets up a main Express.js server and provides functionality to run additional servers
 * by spawning child processes. It includes middleware for handling cross-origin requests, parsing JSON payloads, 
 * and serving routes for authentication and user-related functionalities.
 * 
 * Features:
 * - Main Express server on port 3000.
 * - Routes for authentication and user file uploads.
 * - Capability to run additional servers using the `runServer` function.
 * - Logs server activity and handles errors for spawned server processes.
 * 
 * @requires express - Web framework for creating the main server.
 * @requires body-parser - Middleware for parsing incoming JSON requests.
 * @requires cors - Middleware for enabling cross-origin resource sharing.
 * @requires child_process.spawn - To spawn additional server processes.
 * @requires ./auth/routes.js - Routes for authentication.
 * @requires ./tables/table_routes.js - Routes for table-related functionalities.
 **/

// Define function to run additional servers
// function runServer(filePath, port) {
//     const serverProcess = spawn('node', [filePath]);

//     serverProcess.stdout.on('data', (data) => {
//         console.log(`Server on port ${port}: ${data}`);
//     });

//     serverProcess.stderr.on('data', (data) => {
//         console.error(`Error on server at port ${port}: ${data}`);
//     });

//     serverProcess.on('close', (code) => {
//         console.log(`Server at port ${port} exited with code ${code}`);
//     });
// }

// Main Express App

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());



// Routes
app.use('/api/auth', authRoutes);
app.use('/api/tables', tableRoutes); // Mounting table routes under '/api/tables'

// Root Route
app.get('/', (req, res) => {
  res.send('Hello, Node.js!');
});

// Only start the server if not in test environment
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    const baseUrl = process.env.BASE_URL || 'http://localhost:3000';
    console.log(`Main server is running on ${baseUrl}`);
  });
}

// Export app for testing
export default app;