const mongoose = require("mongoose");

const tvWatchListSchema = new mongoose.Schema(
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
  { collection: "Tv_WatchLists" },
  { timestamps: true } // Tự động thêm các trường createdAt và updatedAt
);

const TvWatchLists = mongoose.model("Tv_WatchLists", tvWatchListSchema);

module.exports = TvWatchLists;
