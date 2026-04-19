import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';
import connectDB from './config/db.js';
import projectRoutes from './routes/projectRoutes.js';
import taskRoutes from './routes/taskRoutes.js';
import userRoutes from './routes/userRoutes.js';

dotenv.config();

// Connect to Database
connectDB();

const app = express();

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// Add a test health route
app.get('/api/health', (req, res) => {
    res.status(200).json({ 
        status: 'server is running', 
        database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected' 
    });
});

// Routes
app.use('/api/projects', projectRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/users', userRoutes);

const PORT = process.env.PORT || 8080;

app.get('/', (req, res) => {
  res.send(`Server is listening on port ${PORT}!`);
});

app.listen(PORT , ()=>{
    console.log(`Server is running on port ${PORT}`);
})