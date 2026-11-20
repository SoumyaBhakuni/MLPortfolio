import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 8000,
});

export async function fetchTask01EDA() {
  const response = await apiClient.get("/api/task01/eda");
  return response.data?.data;
}