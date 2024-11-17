// src/api/Api.js
import axios from "axios";

const BASE_API_URL = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: BASE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

const login = async (username, password) => {
  try {
    // Gửi yêu cầu đăng nhập đến backend
    const response = await api.post("api/login", {
      username,
      password,
    });

    // Kiểm tra xem phản hồi có chứa token không
    if (response.data.token) {
      // Lưu token vào localStorage
      localStorage.setItem("token", response.data.token);

      return { success: true, token: response.data.token };
    } else {
      // Nếu không có token, trả về thông báo lỗi
      throw new Error(response.data.msg || "Login failed");
    }
  } catch (error) {
    console.error("Login error:", error);

    // Kiểm tra xem lỗi có thông báo từ server không
    const errorMsg =
      error.response?.data?.msg || "An error occurred during login.";
    throw new Error(errorMsg);
  }
};
const movieFavorites = {
  getFavorites: async (token) => {
    try {
      const response = await api.get("api/favorites/getFavorites", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      throw new Error("Error fetching favorites");
    }
  },

  addFavorite: async (movieId, token) => {
    try {
      const response = await api.post(
        "api/favorites/addFavorite",
        { movieId },
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

  deleteFavorite: async (movieId, token) => {
    try {
      const response = await api.delete(
        `api/favorites/deleteFavorite/${movieId}`,
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
const watchLists = {
  // Lấy danh sách watchlist của người dùng
  getWatchLists: async (token) => {
    try {
      const response = await api.get("api/watchList/getWatchLists", {
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
  addWatchList: async (movieId, token) => {
    try {
      const response = await api.post(
        "api/watchList/addWatchList",
        { movieId },
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
        `api/watchList/deleteWatchList/${movieId}`,
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

const getMovieM3u8Link = async (title) => {
  try {
    // Tìm kiếm phim theo tiêu đề
    const searchResponse = await axios.get(
      `https://phimapi.com/v1/api/tim-kiem?keyword=${title}`
    );
    const searchData = searchResponse.data;
    if (searchData.status === "success") {
      const movies = searchData.data.items;
      const movie = movies.find((movie) => movie.origin_name === title);

      if (movie) {
        // Lấy thông tin chi tiết của phim
        const movieDetailsResponse = await axios.get(
          `https://phimapi.com/phim/${movie.slug}`
        );
        const movieDetails = movieDetailsResponse.data;

        const linkm3u8 =
          movieDetails?.episodes?.[0]?.server_data?.[0]?.link_m3u8 || "";
        return linkm3u8;
      } else {
        throw new Error("Movie not found.");
      }
    } else {
      throw new Error("Error fetching movie search results.");
    }
  } catch (err) {
    console.error("Error fetching movie M3U8 link: ", err.message);
    throw new Error("Failed to fetch M3U8 link.");
  }
};

export { movieFavorites, watchLists, getMovieM3u8Link, login };
