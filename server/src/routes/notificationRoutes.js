const express = require("express");
const router = express.Router();

const {
  getNotifications,
  createNotification,
  updateNotification,
  deleteNotification,
} = require("@/controllers/notificationsController");

const { verifyToken, verifyAdmin} = require("@/middlewares/authMiddleware");

// Middleware to verify if user is admin
router.use(verifyToken, verifyAdmin);

// Routes for notifications management
router.get("/", getNotifications);    
router.post("/", createNotification); 
router.put("/:notificationId", updateNotification);
router.delete("/:notificationId", deleteNotification);

module.exports = router;