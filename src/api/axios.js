import axios from "axios";

export const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

let accessToken = null;
export const setAccessToken = (token) => { accessToken = token; };
export const getAccessToken = () => accessToken;

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  if (accessToken) config.headers.Authorization = `Bearer ${accessToken}`;
  return config;
});

let isRefreshing = false;
let waitQueue = [];

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;
      if (isRefreshing) {
        return new Promise((resolve, reject) => waitQueue.push({ resolve, reject, original }));
      }
      isRefreshing = true;
      try {
        const res = await axios.get(`${API_URL}/api/auth/refresh-token`, { withCredentials: true });
        setAccessToken(res.data.accessToken);
        waitQueue.forEach(({ resolve, original: o }) => {
          o.headers.Authorization = `Bearer ${res.data.accessToken}`;
          resolve(api(o));
        });
        waitQueue = [];
        original.headers.Authorization = `Bearer ${res.data.accessToken}`;
        return api(original);
      } catch (refreshErr) {
        waitQueue.forEach(({ reject }) => reject(refreshErr));
        waitQueue = [];
        setAccessToken(null);
        return Promise.reject(refreshErr);
      } finally {
        isRefreshing = false;
      }
    }
    return Promise.reject(error);
  }
);

export default api;