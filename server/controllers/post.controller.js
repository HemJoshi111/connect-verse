import Post from '../models/post.model.js';
import User from '../models/user.model.js';
import cloudinary from '../config/cloudinary.js';

// @desc    Create a new post
// @route   POST /api/posts/create
// @access  Private
export const createPost = async (req, res) => {
    try {
        const { text } = req.body;
        let imgUrl = '';

        // 1. Check if neither text nor image is provided
        if (!text && !req.file) {
            return res.status(400).json({
                success: false,
                message: 'Post must contain text or an image'
            });
        }

        // 2. Handle Image Upload (If exists)
        if (req.file) {
            // We need to wrap Cloudinary's upload_stream in a Promise 
            // because it uses callbacks by default, but we want async/await.
            const uploadToCloudinary = () => {
                return new Promise((resolve, reject) => {
                    const uploadStream = cloudinary.uploader.upload_stream(
                        { resource_type: 'auto' }, // auto detects jpg, png, etc.
                        (error, result) => {
                            if (error) {
                                reject(error);
                            } else {
                                resolve(result); // result contains the secure_url
                            }
                        }
                    );
                    // Write the buffer to the stream to start upload
                    uploadStream.end(req.file.buffer);
                });
            };

            const result = await uploadToCloudinary();
            imgUrl = result.secure_url; // Get the URL of the uploaded image
        }

        // 3. Create Post in Database
        const newPost = new Post({
            user: req.user._id, // Got from auth middleware
            text,
            img: imgUrl,
        });

        await newPost.save();

        res.status(201).json({
            success: true,
            message: 'Post created successfully',
            data: newPost,
        });

    } catch (error) {
        console.log('Error in createPost:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};