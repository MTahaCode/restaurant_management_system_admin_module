require("module-alias/register");
require('dotenv').config();

const express = require("express");
const app = express();
const connectDb = require("@/config/connectDb");

const PORT = 3000;

const authRoutes = require("@/routes/authRoutes");

app.use(express.json());

app.use("/auth", authRoutes);

//DEFAULT ROUTE
app.use((req, res, next) => {
    res.status(404).json({ error: 'Route not found' });
});

//FOR STARTING THE SERVER
app.listen(PORT, () => {
    connectDb();
    console.log("App listenting of port 3000")
});