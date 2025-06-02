import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

let logoutHandler = null;

export const setLogoutHandler = (handler) => {
  logoutHandler = handler;
};

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      error.response &&
      (error.response.status === 401 || error.response.status === 403)
    ) {
      if (logoutHandler) logoutHandler();
    }
    return Promise.reject(error);
  }
);

export default api;
