import { spawn } from 'child_process';
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';

// Define function to run additional servers
function runServer(filePath, port) {
    const serverProcess = spawn('node', [filePath]);

    serverProcess.stdout.on('data', (data) => {
        console.log(`Server on port ${port}: ${data}`);
    });

    serverProcess.stderr.on('data', (data) => {
        console.error(`Error on server at port ${port}: ${data}`);
    });

    serverProcess.on('close', (code) => {
        console.log(`Server at port ${port} exited with code ${code}`);
    });
}

// Main Express App
const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
import authRoutes from './auth/routes.js';
import userRoutes from './user/userRoutes.js';

app.use('/auth', authRoutes);
app.use('/user', userRoutes);

// Root Route
app.get('/', (req, res) => {
    res.send('Hello, Node.js!');
});

// Start Main Server
app.listen(PORT, () => {
    console.log(`Main server is running on http://localhost:${PORT}`);
});