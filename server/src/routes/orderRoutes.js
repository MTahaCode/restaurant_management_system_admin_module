const express = require("express");
const router = express.Router();
const {
  getOrders,
  getOrderById,
  updateOrder,
  deleteOrder,
} = require("@/controllers/orderController");

const { verifyToken, verifyAdmin } = require("@/middlewares/authMiddleware");

// Middleware to verify if user is admin
router.use(verifyToken, verifyAdmin);

// Routes for order history management
router.get("/", getOrders);               
router.get("/:orderId", getOrderById);   
router.put("/:orderId", updateOrder);    
router.delete("/:orderId", deleteOrder); 

module.exports = router;