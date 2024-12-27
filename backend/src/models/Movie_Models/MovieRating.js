// models/MovieRating.js
const mongoose = require("mongoose");

// Định nghĩa schema cho Movie_Rating
const movieRatingSchema = new mongoose.Schema(
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
    rating: {
      type: Number,
      required: true,
      min: 1, // Giá trị tối thiểu của số sao
      max: 5, // Giá trị tối đa của số sao
    },
    comment: {
      type: String,
      default: "", // Giá trị mặc định là chuỗi rỗng nếu không có bình luận
      trim: true, // Loại bỏ khoảng trắng thừa ở đầu và cuối chuỗi
    },
  },
  {
    collection: "Movie_Rating", // Tên collection
    timestamps: true, // Tự động thêm các trường createdAt và updatedAt
  }
);

// Tạo model MovieRating từ schema
const MovieRating = mongoose.model("Movie_Rating", movieRatingSchema);

module.exports = MovieRating;
