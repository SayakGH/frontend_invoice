import axios from "axios";

const api = axios.create({
  baseURL:
    import.meta.env.VITE_API_URL ||
    "https://4krss5vu51.execute-api.ap-south-1.amazonaws.com/prod/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
