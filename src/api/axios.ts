import axios from "axios";

const api = axios.create({
  baseURL:
    import.meta.env.VITE_API_URL ||
    "https://hrv434kxwrxpbtaeoayhici2ju0jnomy.lambda-url.ap-south-1.on.aws/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
