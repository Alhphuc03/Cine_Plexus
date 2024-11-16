// src/api/Api.js
import axios from "axios";

const BASE_API_URL = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: BASE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});
const tvFavorites = {
  getFavorites: async (token) => {
    try {
      const response = await api.get("/api/favoritesTv/getFavorites", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      throw new Error("Error fetching favorites");
    }
  },

  addFavorite: async (tvId, token) => {
    try {
      const response = await api.post(
        "/api/favoritesTv/addFavorite",
        { tvId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      throw new Error("Error adding to favorites");
    }
  },

  deleteFavorite: async (tvId, token) => {
    try {
      const response = await api.delete(
        `/api/favoritesTv/deleteFavorite/${tvId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("data", response.data);
      return response.data;
    } catch (error) {
      throw new Error("Error deleting from favorites");
    }
  },
};
const tvWatchLists = {
  // Lấy danh sách watchlist của người dùng
  getWatchLists: async (token) => {
    try {
      const response = await api.get("/api/watchListTv/getWatchLists", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      throw new Error("Error fetching watch lists");
    }
  },
  // Thêm phim vào danh sách watchlist
  addWatchList: async (tvId, token) => {
    try {
      const response = await api.post(
        "/api/watchListTv/addWatchList",
        { tvId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      throw new Error("Error adding to watch list");
    }
  },
  // Xoá phim khỏi danh sách watchlist
  deleteWatchList: async (movieId, token) => {
    try {
      const response = await api.delete(
        `/api/watchListTv/deleteWatchList/${movieId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("data", response.data);
      return response.data;
    } catch (error) {
      throw new Error("Error deleting from watch list");
    }
  },
};

export { tvFavorites, tvWatchLists };
