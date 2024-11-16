const mongoose = require("mongoose");

// Định nghĩa schema cho TV_Favorites

const tvFavoritesSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Liên kết với model User
      required: true,
    },
    tvId: {
      type: String,
      required: true,
    },
  },
  { collection: "TV_Favorites" },
  { timestamps: true }
);

// Tạo model TvFavorites từ schema
const TvFavorites = mongoose.model("TV_Favorites", tvFavoritesSchema);

module.exports = TvFavorites;
