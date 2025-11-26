import express from 'express';

import { registerUser, loginUser, getMe } from '../controllers/auth.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import upload from '../middleware/upload.middleware.js';

const router = express.Router();

// Route: POST /api/auth/register
router.post('/register', upload.single('profilePicture'), registerUser);


// Route: POST /api/auth/login
router.post('/login', loginUser);


// Route: GET /api/auth/me
// Note: We add the 'protect' middleware here  to secure it
router.get('/me', protect, getMe)



export default router;