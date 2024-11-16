import axios from "axios";

const BASE_API_URL = import.meta.env.VITE_API_URL;

const Api = {
  getUserDetails: async () => {
    const token = localStorage.getItem("token");
    const response = await axios.get(`${BASE_API_URL}/api/user-detail`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },
};

export default Api;
