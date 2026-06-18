import axios from "axios";

const API_URL =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.DEV ? "http://localhost:8000/api" : "/api");

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refreshToken = localStorage.getItem("refresh_token");
      if (refreshToken) {
        try {
          const response = await axios.post(`${API_URL}/auth/refresh`, null, {
            params: { refresh_token: refreshToken },
          });

          const { access_token, refresh_token } = response.data;
          localStorage.setItem("access_token", access_token);
          localStorage.setItem("refresh_token", refresh_token);

          originalRequest.headers.Authorization = `Bearer ${access_token}`;
          return api(originalRequest);
        } catch {
          localStorage.removeItem("access_token");
          localStorage.removeItem("refresh_token");
          window.location.href = "/login";
        }
      }
    }

    return Promise.reject(error);
  },
);

// Auth API
export const authAPI = {
  signup: (data) => api.post("/auth/signup", data),
  login: (data) => api.post("/auth/login", data),
  logout: () => api.post("/auth/logout"),
  getMe: () => api.get("/auth/me"),
};

// Quiz API
export const quizAPI = {
  getQuizzes: (params) => api.get("/quizzes", { params }),
  getQuiz: (id) => api.get(`/quizzes/${id}`),
  generateQuiz: (data) => api.post("/quizzes/generate", data),
  submitQuiz: (id, data) => api.post(`/quizzes/${id}/submit`, data),
  deleteQuiz: (id) => api.delete(`/quizzes/${id}`),
};

// Notes API
export const notesAPI = {
  getNotes: (params) => api.get("/notes", { params }),
  getNote: (id) => api.get(`/notes/${id}`),
  createNote: (data) => api.post("/notes", data),
  generateNotes: (data) => api.post("/notes/generate", data),
  updateNote: (id, data) => api.put(`/notes/${id}`, data),
  deleteNote: (id) => api.delete(`/notes/${id}`),
  toggleFavorite: (id) => api.post(`/notes/${id}/favorite`),
};

// Leaderboard API
export const leaderboardAPI = {
  getLeaderboard: (params) => api.get("/leaderboard", { params }),
  getSubjects: () => api.get("/leaderboard/subjects"),
  getUserProgress: (userId) => api.get(`/leaderboard/user/${userId}`),
};

// Dashboard API
export const dashboardAPI = {
  getSummary: () => api.get("/dashboard/summary"),
};

// AI API
export const aiAPI = {
  chat: (data) => api.post("/ai/chat", data),
};

export default api;
