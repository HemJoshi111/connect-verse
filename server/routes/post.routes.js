import express from "express";
import { protect } from '../middleware/auth.middleware.js';
import upload from '../middleware/upload.middleware.js'; // The Multer config
import { createPost } from '../controllers/post.controller.js';

const router = express.Router();

// @route   POST /api/posts/create
// @desc    Create a new post with image
// @access  Private
// Flow: Check Token -> Check/Process File -> Run Controller Logic
router.post('/create', protect, upload.single('img'), createPost);

export default router;