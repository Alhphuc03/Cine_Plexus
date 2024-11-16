const TvFavorites = require("../../models/TV_Models/TvFavorites");

// Lấy danh sách TV yêu thích của người dùng
const getFavoritesTv = async (req, res) => {
  try {
    const favorites = await TvFavorites.find({
      userId: req.user.userId, // Lấy userId từ token
    }).populate("userId", "username email avatar");

    res.json(favorites);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server error" });
  }
};

const addFavoriteTv = async (req, res) => {
  const { tvId } = req.body;

  // Đảm bảo rằng userId tồn tại trong token
  if (!req.user || !req.user.userId) {
    return res.status(400).json({ msg: "User ID is required" });
  }

  try {
    const favorite = new TvFavorites({
      userId: req.user.userId, // Lấy userId từ token
      tvId,
    });
    await favorite.save();
    res.status(201).json({ msg: "Tv added to favorites", favorite });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server error", error: error.message });
  }
};

// Xóa TV khỏi danh sách yêu thích
const removeFavoriteTv = async (req, res) => {
  const { tvId } = req.params; // Lấy tvId từ tham số URL

  try {
    const favorite = await TvFavorites.findOneAndDelete({
      userId: req.user.userId,
      tvId,
    });

    if (!favorite) {
      return res.status(404).json({ msg: "Favorite not found" });
    }

    res.json({ msg: "Tv removed from favorites", favorite });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server error" });
  }
};

module.exports = { getFavoritesTv, addFavoriteTv, removeFavoriteTv };
