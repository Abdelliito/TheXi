import axios from 'axios';

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://worldcup26.ir';
export const API_TIMEOUT = Number(import.meta.env.VITE_API_TIMEOUT_MS || 10000);

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.message ||
      'TheXI could not reach the tournament feed.';
    return Promise.reject(new Error(message));
  },
);

export const getGames = async () => {
  const response = await api.get('/get/games');
  return response.data.games || [];
};

export const getTeams = async () => {
  const response = await api.get('/get/teams');
  return response.data.teams || [];
};

export default api;
