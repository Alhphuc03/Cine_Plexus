const tvRating = require("../../models/TV_Models/TvRatings");

const getRatingTvs = async (req, res) => {
  try {
    const ratings = await tvRating
      .find({
        userId: req.user.userId, // Sử dụng req.user.userId từ token
      })
      .populate("userId", "username email avatar");

    res.json(ratings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server error", error: error.message });
  }
};

const addOrUpdateRatingTv = async (req, res) => {
  const { tvId, rating, comment } = req.body;

  // Đảm bảo rằng userId tồn tại
  if (!req.user || !req.user.userId) {
    return res.status(400).json({ msg: "User ID is required" });
  }

  try {
    const existingRating = await tvRating.findOne({
      userId: req.user.userId,
      tvId,
    });

    if (existingRating) {
      // Cập nhật đánh giá nếu đã tồn tại
      existingRating.rating = rating;
      existingRating.comment = comment || existingRating.comment;
      await existingRating.save();
      return res.json({ msg: "Rating updated", rating: existingRating });
    }

    const newRating = new tvRating({
      userId: req.user.userId,
      tvId,
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

const removeRatingTv = async (req, res) => {
  const { tvId } = req.params;

  try {
    const rating = await tvRating.findOneAndDelete({
      userId: req.user.userId,
      tvId,
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

module.exports = { getRatingTvs, addOrUpdateRatingTv, removeRatingTv };
