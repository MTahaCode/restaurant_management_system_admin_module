const express = require("express");
const router = express.Router();

const {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} = require("@/controllers/userController");

const { verifyToken, verifyAdmin } = require("@/middlewares/authMiddleware");

// Middleware to verify if user is admin
router.use(verifyToken);

// Routes for user management
router.post("/", verifyAdmin, createUser);          
router.get("/users", verifyAdmin, getUsers);             
router.delete("/:userId", verifyAdmin, deleteUser);

router.put("/:userId", updateUser); 
router.get("/:userId", getUserById);

module.exports = router;