require("module-alias/register");
require('dotenv').config();

const express = require("express");
const app = express();
const cors = require("cors");
const connectDb = require("@/config/connectDb");

const PORT = 3000;

const authRoutes = require("@/routes/authRoutes");
const userRoutes = require("@/routes/userRoutes");
const orderRoutes = require("@/routes/orderRoutes");
const notificationRoutes = require("@/routes/notificationRoutes");

app.use(cors());
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/user", userRoutes);
app.use("/order", orderRoutes);
app.use("/notifications", notificationRoutes);

//DEFAULT ROUTE
app.use((req, res, next) => {
    res.status(404).json({ error: 'Route not found!' });
});

//FOR STARTING THE SERVER
app.listen(PORT, () => {
    connectDb();
    console.log("App listenting of port 3000")
});