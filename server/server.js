import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import authRoutes from './routes/auth.routes.js'
import postRoutes from './routes/post.routes.js'
import userRoutes from './routes/user.routes.js';
import notificationRoutes from './routes/notification.routes.js';

dotenv.config(); // Load environment variables from .env file
connectDB(); // Connect to the database
const app = express(); // Initialize the Express application

// Middleware
app.use(cors()); // Handles Cross-Origin Resource Sharing
app.use(express.json()); // Parse JSON request bodies

// ------Routes--------
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/users', userRoutes);
app.use('/api/notifications', notificationRoutes);

const PORT = process.env.PORT || 5000; // Use the PORT from environment variables or default to 5000

// Start the server
app.listen(PORT, () => {
    console.log(`⚙️ Server is running on port ${PORT}`);
});
