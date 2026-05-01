import axios from "axios";

const api = axios.create({
//   baseURL: "http://localhost:5001/api/v1",
 baseURL: import.meta.env.VITE_API_URL
});

// attach token automatically
api.interceptors.request.use((config) => {

  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization =
      `Bearer ${token}`;
  }

  return config;
});

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/";
    }
    return Promise.reject(error);
  }
);

// Auth APIs
export const authAPI = {
  register: (data) => api.post("/auth/register", data),
  login: (data) => api.post("/auth/login", data),
};

// Course APIs
export const courseAPI = {
  getCourses: () => api.get("/courses"),
  getCourseById: (id) => api.get(`/courses/${id}`),
  createCourse: (data) => api.post("/courses", data),
  updateCourse: (id, data) => api.put(`/courses/${id}`, data),
  deleteCourse: (id) => api.delete(`/courses/${id}`),
};

// Enrollment APIs
export const enrollmentAPI = {
  enrollCourse: (courseId) => api.post(`/enrollments/${courseId}`),
  getMyEnrollments: () => api.get("/enrollments/my-courses"),
};

export default api;