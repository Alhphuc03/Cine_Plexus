// controller/favorites/favoritesController.js
const TvWatchLists = require("../../models/TV_Models/TvWatchList");

const getWatchListsTv = async (req, res) => {
  try {
    const watchLists = await TvWatchLists.find({
      userId: req.user.userId,
    }).populate("userId", "username email avatar");

    res.json(watchLists);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server error" });
  }
};

const addWatchListsTv = async (req, res) => {
  const { tvId } = req.body;

  if (!tvId) {
    return res.status(400).json({ msg: "Tv ID is required" });
  }

  // Đảm bảo rằng userId tồn tại
  if (!req.user || !req.user.userId) {
    return res.status(400).json({ msg: "User ID is required" });
  }

  try {
    const watchList = new TvWatchLists({
      userId: req.user.userId, // Sử dụng userId từ token
      tvId,
    });
    await watchList.save();
    res.status(201).json({ msg: "Tv added to watchList", watchList });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server error", error: error.message });
  }
};

// Xóa phim khỏi danh sách yêu thích
const removeWatchListTv = async (req, res) => {
  const { tvId } = req.params;

  try {
    const watchList = await TvWatchLists.findOneAndDelete({
      userId: req.user.userId,
      tvId,
    });
    if (!watchList) {
      return res.status(404).json({ msg: "Watch list not found" });
    }
    res.json({ msg: "Tv removed from watchList" }); // Không cần phải trả về watchList đã xóa
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server error" });
  }
};

module.exports = { getWatchListsTv, addWatchListsTv, removeWatchListTv };
