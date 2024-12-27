// models/MovieFavorites.js
const mongoose = require("mongoose");

// Định nghĩa schema cho WatchList_Movies

const movieWatchListSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Liên kết với model User
      required: true,
    },
    movieId: {
      type: String,
      required: true,
    },
    movieName: {
      type: String,
      required: true,
    },
    movieImg: {
      type: String,
      required: true,
    },
  },
  { collection: "WatchList_Movies" },
  { timestamps: true } // Tự động thêm các trường createdAt và updatedAt
);

// Tạo model MovieFavorites từ schema
const MovieFavorites = mongoose.model("WatchList_Movies", movieWatchListSchema);

module.exports = MovieFavorites;
