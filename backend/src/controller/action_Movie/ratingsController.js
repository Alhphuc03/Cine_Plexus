const MovieRating = require("../../models/Movie_Models/MovieRating");

// Lấy danh sách đánh giá của người dùng
const getRatings = async (req, res) => {
  try {
    const ratings = await MovieRating.find({
      userId: req.user.userId, // Sử dụng req.user.userId từ token
    }).populate("userId", "username email avatar");

    res.json(ratings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server error", error: error.message });
  }
};

// Thêm hoặc cập nhật đánh giá phim
const addOrUpdateRating = async (req, res) => {
  const { movieId, rating, comment } = req.body;

  // Đảm bảo rằng userId tồn tại
  if (!req.user || !req.user.userId) {
    return res.status(400).json({ msg: "User ID is required" });
  }

  try {
    // Kiểm tra nếu đã có đánh giá trước đó
    const existingRating = await MovieRating.findOne({
      userId: req.user.userId,
      movieId,
    });

    if (existingRating) {
      // Cập nhật đánh giá nếu đã tồn tại
      existingRating.rating = rating;
      existingRating.comment = comment || existingRating.comment; // Giữ bình luận cũ nếu không cung cấp mới
      await existingRating.save();
      return res.json({ msg: "Rating updated", rating: existingRating });
    }

    // Thêm mới đánh giá
    const newRating = new MovieRating({
      userId: req.user.userId,
      movieId,
      rating,
      comment,
    });
    await newRating.save();
    res.status(201).json({ msg: "Rating added", rating: newRating });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server error", error: error.message });
  }
};

// Xóa đánh giá phim
const removeRating = async (req, res) => {
  const { movieId } = req.params; // Lấy movieId từ tham số URL

  try {
    const rating = await MovieRating.findOneAndDelete({
      userId: req.user.userId,
      movieId,
    });
    if (!rating) {
      return res.status(404).json({ msg: "Rating not found" });
    }
    res.json({ msg: "Rating removed", rating });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server error", error: error.message });
  }
};

module.exports = { getRatings, addOrUpdateRating, removeRating };
