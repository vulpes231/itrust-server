const mongoose = require("mongoose");

const MONGO_URI = process.env.MONGO_URI;

const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Connected to database");
  } catch (error) {
    console.log(error, "Error connecting to database.");
  }
};

module.exports = { connectDB };
