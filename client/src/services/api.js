import axios from "axios";

const api = axios.create({
  baseURL: "https://api.quaq.dev/",
});

export default api;
