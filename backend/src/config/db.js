const mongoose = require("mongoose");
require("dotenv").config(); // Nạp file .env
const User = require("../models/userModels"); // Import model User

const connectDB = async () => {
  try {
    // Lấy giá trị MONGO_URI từ biến môi trường
    const mongoURI = process.env.MONGO_URI;
    console.log("MongoDB URI:", mongoURI);

    // Kết nối tới MongoDB
    const conn = await mongoose.connect(mongoURI);
    console.log(`MongoDB connected: ${conn.connection.host}`);

    // // Log dữ liệu của collection Users
    // const users = await User.find(); // Lấy tất cả người dùng từ collection Users
    // console.log("Users data:", JSON.stringify(users, null, 2)); // Log dữ liệu
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1); // Dừng server nếu kết nối thất bại
  }
};

module.exports = connectDB;
