import axios from "axios";

const url = "http://localhost:3000";
const api = axios.create({
  baseURL: url,
});

export const fetchPosts = async () => {
  try {
    const response = await api.get("/posts");
    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch posts");
  }
};

export const updateFavorites = async (id: string) => {
  try {
    const response = await api.put(`/posts/${id}/favorite`);
    return response.data;
  } catch (error) {
    throw new Error("Failed to update favorites");
  }
};

export default api;
