// controller/favorites/favoritesController.js
const MovieWatchLists = require("../../models/Movie_Models/MovieWatchList");

// Lấy danh sách phim yêu thích của người dùng
const getWatchLists = async (req, res) => {
  try {
    const watchLists = await MovieWatchLists.find({
      userId: req.user.userId, // Sử dụng req.user.userId
    }).populate("userId", "username email avatar");

    res.json(watchLists);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server error" });
  }
};

const addWatchLists = async (req, res) => {
    const { movieId } = req.body;
  
    // Kiểm tra movieId có tồn tại trong body không
    if (!movieId) {
      return res.status(400).json({ msg: "Movie ID is required" });
    }
  
    // Đảm bảo rằng userId tồn tại
    if (!req.user || !req.user.userId) {
      return res.status(400).json({ msg: "User ID is required" });
    }
  
    try {
      const watchList = new MovieWatchLists({
        userId: req.user.userId, // Sử dụng userId từ token
        movieId,
      });
      await watchList.save();
      res.status(201).json({ msg: "Movie added to watchList", watchList });
    } catch (error) {
      console.error(error);
      res.status(500).json({ msg: "Server error", error: error.message });
    }
  };
  

// Xóa phim khỏi danh sách yêu thích
const removeWatchList = async (req, res) => {
    const { movieId } = req.params; // Lấy movieId từ tham số URL
  
    try {
      const watchList = await MovieWatchLists.findOneAndDelete({
        userId: req.user.userId,
        movieId,
      });
      if (!watchList) {
        return res.status(404).json({ msg: "Watch list not found" });
      }
      res.json({ msg: "Movie removed from watchList" }); // Không cần phải trả về watchList đã xóa
    } catch (error) {
      console.error(error);
      res.status(500).json({ msg: "Server error" });
    }
  };
  
module.exports = { getWatchLists, addWatchLists, removeWatchList };
