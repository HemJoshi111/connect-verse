import User from '../models/user.model.js';
import cloudinary from '../config/cloudinary.js';

// @desc    Get user profile by ID
// @route   GET /api/users/:id
// @access  Private
export const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        res.status(200).json({ success: true, data: user });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Update user profile (Bio + Profile Picture)
// @route   PUT /api/users/update
// @access  Private
export const updateUserProfile = async (req, res) => {
    try {
        const { bio } = req.body;
        let profilePicture = req.user.profilePicture; // Default to old pic

        // 1. Handle Image Upload (If a file was sent)
        if (req.file) {
            const uploadToCloudinary = () => {
                return new Promise((resolve, reject) => {
                    const stream = cloudinary.uploader.upload_stream(
                        { resource_type: 'auto' },
                        (error, result) => {
                            if (error) reject(error);
                            else resolve(result);
                        }
                    );
                    stream.end(req.file.buffer);
                });
            };

            const result = await uploadToCloudinary();
            profilePicture = result.secure_url;
        }

        // 2. Update the User in Database
        const updatedUser = await User.findByIdAndUpdate(
            req.user._id,
            {
                bio: bio || req.user.bio, // Keep old bio if not changed
                profilePicture
            },
            { new: true, runValidators: true } // Return the new updated object
        ).select('-password');

        res.status(200).json({
            success: true,
            message: 'Profile updated successfully',
            data: updatedUser,
        });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};