const Notification = require("@/models/notificationModel");
const User = require("@/models/userModel");

// Get all notifications (with optional filters)
const getNotifications = async (req, res) => {
    try {
        const { recipientId, isRead, type, priority, date } = req.query;

        // Build query object dynamically based on available filters
        const query = {};
        if (recipientId) query.recipient = recipientId;
        if (isRead !== undefined) query.isRead = isRead;
        if (type) query.type = type;
        if (priority) query.priority = priority;
        if (date) query.createdAt = { $gte: new Date(date) };

        const notifications = await Notification.find(query)
        .populate("recipient sender")
        .sort({ createdAt: -1 }); // Sort by most recent notifications first

        return res.status(200).json({
            message: "Notifications fetched successfully.",
            notifications,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error fetching notifications." });
    }
};

// Create a new notification
const createNotification = async (req, res) => {
    try {
        const {
            recipient,
            sender,
            type,
            title,
            message,
            relatedEntity,
            priority,
            expiresAt,
        } = req.body;

        // Validate recipient and sender exist
        const recipientUser = await User.findById(recipient);
        if (!recipientUser) {
            return res.status(404).json({ message: "Recipient user not found." });
        }

        // Create the new notification
        const newNotification = new Notification({
            recipient,
            sender,
            type,
            title,
            message,
            relatedEntity,
            priority,
            expiresAt,
        });

        // Save the new notification to the database
        await newNotification.save();

        return res.status(201).json({
            message: "Notification created successfully.",
            notification: newNotification,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error creating notification." });
    }
};

// Update an existing notification
const updateNotification = async (req, res) => {
    try {
        const { notificationId } = req.params;
        const { title, message, priority, expiresAt, isRead } = req.body;

        // Validate if the notification exists
        const notification = await Notification.findById(notificationId);
        if (!notification) {
            return res.status(404).json({ message: "Notification not found." });
        }

        // Update the notification fields
        notification.title = title || notification.title;
        notification.message = message || notification.message;
        notification.priority = priority || notification.priority;
        notification.expiresAt = expiresAt || notification.expiresAt;
        notification.isRead = isRead !== undefined ? isRead : notification.isRead;

        // Save the updated notification
        await notification.save();

        return res.status(200).json({
            message: "Notification updated successfully.",
            notification,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error updating notification." });
    }
};

// Delete a notification
const deleteNotification = async (req, res) => {
    try {
        const { notificationId } = req.params;

        // Validate if the notification exists
        const notification = await Notification.findById(notificationId);
        if (!notification) {
            return res.status(404).json({ message: "Notification not found." });
        }

        // Delete the notification
        await notification.remove();

        return res.status(200).json({
            message: "Notification deleted successfully.",
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error deleting notification." });
    }
};

module.exports = {
    getNotifications,
    createNotification,
    updateNotification,
    deleteNotification,
};