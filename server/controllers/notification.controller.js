import Notification from '../models/notification.model.js';

// @desc    Get my notifications
// @route   GET /api/notifications
// @access  Private
export const getNotifications = async (req, res) => {
    try {
        const userId = req.user._id;

        // Find notifications sent TO me, populate the sender's info
        const notifications = await Notification.find({ to: userId })
            .populate({
                path: 'from',
                select: 'username profilePicture',
            })
            .sort({ createdAt: -1 }); // Newest first

        // Optional: Mark all as read when fetched
        await Notification.updateMany({ to: userId }, { read: true });

        res.status(200).json(notifications);
    } catch (error) {
        console.log('Error in getNotifications:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Delete all notifications
// @route   DELETE /api/notifications
// @access  Private
export const deleteNotifications = async (req, res) => {
    try {
        const userId = req.user._id;

        await Notification.deleteMany({ to: userId });

        res.status(200).json({ success: true, message: 'Notifications deleted successfully' });
    } catch (error) {
        console.log('Error in deleteNotifications:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};