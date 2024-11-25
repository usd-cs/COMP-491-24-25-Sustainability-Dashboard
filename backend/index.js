import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import authRoutes from './auth/routes.js';
import userRoutes from './user/userRoutes.js';


const app = express();
const PORT = 3000;


// Middleware
app.use(cors());
app.use(bodyParser.json());

// Mount auth routes
app.use('/auth', authRoutes);
app.use('/user', userRoutes);


app.get('/', (req, res) => {
  res.send('Hello, Node.js!');
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});