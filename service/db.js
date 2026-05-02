const mongoose = require('mongoose');

module.exports = async () => {
    if (!process.env.MONGODB_URL) {
        console.error("MONGODB_URL is not defined in environment variables");
        return;
    }
    try {
        await mongoose.connect(process.env.MONGODB_URL);
        console.log("Connected to database successfully");
    } catch (error) {
        console.error("Could not connect to the database!", error);
    }
};

