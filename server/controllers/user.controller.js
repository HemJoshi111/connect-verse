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

// @desc    Follow or Unfollow a user
// @route   POST /api/users/follow/:id
// @access  Private
export const followUnfollowUser = async (req, res) => {
    try {
        const { id } = req.params; // The user to follow/unfollow
        const userToModify = await User.findById(id);
        const currentUser = await User.findById(req.user._id);

        if (id === req.user._id.toString()) {
            return res.status(400).json({ success: false, message: 'You cannot follow yourself' });
        }

        if (!userToModify || !currentUser) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        // Check if already following
        const isFollowing = currentUser.following.includes(id);

        if (isFollowing) {
            // Unfollow Logic
            // 1. Remove ID from my 'following' array
            await User.findByIdAndUpdate(req.user._id, { $pull: { following: id } });
            // 2. Remove my ID from their 'followers' array
            await User.findByIdAndUpdate(id, { $pull: { followers: req.user._id } });

            res.status(200).json({ success: true, message: 'User unfollowed successfully' });
        } else {
            // Follow Logic
            // 1. Add ID to my 'following' array
            await User.findByIdAndUpdate(req.user._id, { $push: { following: id } });
            // 2. Add my ID to their 'followers' array
            await User.findByIdAndUpdate(id, { $push: { followers: req.user._id } });

            res.status(200).json({ success: true, message: 'User followed successfully' });
        }

    } catch (error) {
        console.log('Error in followUnfollowUser:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Search for users
// @route   GET /api/users/search/:query
// @access  Private
export const searchUsers = async (req, res) => {
    try {
        const { query } = req.params;

        // Use MongoDB Regex to find matching usernames (case-insensitive)
        // $regex: query -> matches the pattern
        // $options: 'i' -> ignores case (John = john)
        const users = await User.find({
            username: { $regex: query, $options: 'i' },
            _id: { $ne: req.user._id } // Exclude myself from results
        }).select('-password');

        res.status(200).json(users);
    } catch (error) {
        console.log('Error in searchUsers:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};