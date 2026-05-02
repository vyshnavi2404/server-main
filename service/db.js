const mongoose = require('mongoose');

let cachedConnection = null;

module.exports = async () => {
  if (cachedConnection && mongoose.connection.readyState === 1) {
    return cachedConnection;
  }

  if (!process.env.MONGODB_URL) {
    throw new Error('MONGODB_URL is not defined in environment variables');
  }

  try {
    cachedConnection = await mongoose.connect(process.env.MONGODB_URL);
    console.log('Connected to database successfully');
    return cachedConnection;
  } catch (error) {
    console.error('Could not connect to the database!', error.message);
    throw error;
  }
};
