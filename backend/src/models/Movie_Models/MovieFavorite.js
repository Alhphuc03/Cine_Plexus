// models/MovieFavorites.js
const mongoose = require("mongoose");

// Định nghĩa schema cho Movie_Favorites
const movieFavoritesSchema = new mongoose.Schema(
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
  },
  { collection: "Movie_Favorites" },
  { timestamps: true } // Tự động thêm các trường createdAt và updatedAt
);

// Tạo model MovieFavorites từ schema
const MovieFavorites = mongoose.model("Movie_Favorites", movieFavoritesSchema);

module.exports = MovieFavorites;
