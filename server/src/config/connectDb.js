const mongoose = require("mongoose");
const dotenv = require('dotenv');

dotenv.config();

const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/restaurant-cluster';

const connectDb = async () => {

    try {
        await mongoose.connect(mongoURI);

        console.log("MongoDb connected successfully");
    }
    catch (error) {
        console.error('Error connecting to MongoDB:', error);
    }
}

module.exports = connectDb;