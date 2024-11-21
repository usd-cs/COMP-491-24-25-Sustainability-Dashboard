import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import authRoutes from './routes.js'; // Adjusted to relative path

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Mount auth routes
app.use('/api/auth', authRoutes);


app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});