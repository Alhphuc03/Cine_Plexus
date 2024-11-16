const express = require("express");
const { login } = require("../controller/user/authLoginController");
const { userDetail } = require("../controller/user/userDetailController");
const {
  getFavorites,
  addFavorite,
  removeFavorite,
} = require("../controller/action_Movie/favoritesController");

const {
  getWatchLists,
  addWatchLists,
  removeWatchList,
} = require("../controller/action_Movie/watchController");

const {
  getFavoritesTv,
  addFavoriteTv,
  removeFavoriteTv,
} = require("../controller/action_TV/favoritesController");

const {
  getWatchListsTv,
  addWatchListsTv,
  removeWatchListTv,
} = require("../controller/action_TV/watchListController");

const router = express.Router();
const auth = require("../middleware/authMiddleware");

router.post("/login", login);
router.get("/user-detail", auth, userDetail);

// Routes cho phim yêu thích movie
router.get("/favorites/getFavorites", auth, getFavorites);
router.post("/favorites/addFavorite", auth, addFavorite);
router.delete("/favorites/deleteFavorite/:movieId", auth, removeFavorite);

// Routes cho danh sách movie
router.get("/watchList/getWatchLists", auth, getWatchLists);
router.post("/watchList/addWatchList", auth, addWatchLists);
router.delete("/watchList/deleteWatchList/:movieId", auth, removeWatchList);

// Routes cho phim yêu thích TV
router.get("/favoritesTv/getFavorites", auth, getFavoritesTv);
router.post("/favoritesTv/addFavorite", auth, addFavoriteTv);
router.delete("/favoritesTv/deleteFavorite/:tvId", auth, removeFavoriteTv);

// Routes cho  watch list tv
router.get("/watchListTv/getWatchLists", auth, getWatchListsTv);
router.post("/watchListTv/addWatchList", auth, addWatchListsTv);
router.delete("/watchListTv/deleteWatchList/:tvId", auth, removeWatchListTv);

module.exports = router;
