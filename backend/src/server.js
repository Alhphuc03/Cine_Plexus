require("dotenv").config();
const express = require("express");
const cors = require("cors"); // Import cors
const connectDB = require("./config/db");
const authRoutes = require("./router/index");

const app = express();

// Kết nối đến cơ sở dữ liệu
connectDB();

// Sử dụng middleware CORS
app.use(
  cors({
    origin: "http://localhost:5173", // Địa chỉ frontend của bạn
    methods: ["GET", "POST", "DELETE"], // Các phương thức mà bạn muốn cho phép
  })
);

app.use(express.json());

// Sử dụng route
app.use("/api", authRoutes);

// Khởi động server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
