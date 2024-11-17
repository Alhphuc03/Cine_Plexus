require("dotenv").config();
const express = require("express");
const cors = require("cors"); // Import cors
const connectDB = require("./src/config/db");
const authRoutes = require("./src/router/index");

const app = express();

// Kết nối đến cơ sở dữ liệu
connectDB();

// Sử dụng middleware CORS
app.use(
  cors({
    origin: [
      "http://localhost:5173", // Local frontend
      "https://cine-plexus-oc1r.vercel.app",
    ], // Production frontend // Địa chỉ frontend của bạn
    methods: ["GET", "POST", "DELETE"], // Các phương thức mà bạn muốn cho phép
    credentials: true,
  })
);

app.use(express.json());

// Sử dụng route
app.use("/api", authRoutes);

// Khởi động server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
