// controller/favorites/favoritesController.js
const MovieFavorites = require("../../models/Movie_Models/MovieFavorite");

// Lấy danh sách phim yêu thích của người dùng
const getFavorites = async (req, res) => {
  try {
    const favorites = await MovieFavorites.find({
      userId: req.user.userId, // Sử dụng req.user.userId
    }).populate("userId", "username email avatar");

    res.json(favorites);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server error" });
  }
};

const addFavorite = async (req, res) => {
  const { movieId, movieName, movieImg } = req.body;

  // Đảm bảo rằng userId tồn tại
  if (!req.user || !req.user.userId) {
    return res.status(400).json({ msg: "User ID is required" });
  }

  try {
    const favorite = new MovieFavorites({
      userId: req.user.userId, // Sử dụng userId từ token
      movieId,
      movieName,
      movieImg,
    });
    await favorite.save();
    res.status(201).json({ msg: "Movie added to favorites", favorite });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server error", error: error.message });
  }
};

// Xóa phim khỏi danh sách yêu thích
const removeFavorite = async (req, res) => {
  const { movieId } = req.params; // Lấy movieId từ tham số URL

  try {
    const favorite = await MovieFavorites.findOneAndDelete({
      userId: req.user.userId,
      movieId,
    });
    if (!favorite) {
      return res.status(404).json({ msg: "Favorite not found" });
    }
    res.json({ msg: "Movie removed from favorites", favorite });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server error" });
  }
};

module.exports = { getFavorites, addFavorite, removeFavorite };
