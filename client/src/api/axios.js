import axios from "axios";

const api = axios.create({
  baseURL: "https://liabrary-management-and-booking-system-1.onrender.com/api/v1",
  withCredentials: true,
});

export default api;