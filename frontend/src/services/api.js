import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000/api", // Pastikan port sesuai backend
  headers: {
    "Content-Type": "application/json",
  },
});

// --- BAGIAN PENTING: INTERCEPTOR ---
// Setiap kali request dikirim, kode ini akan cek token di localStorage
// dan memasukkannya ke header Authorization
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token"); // Pastikan nama key 'token' sesuai dengan saat login
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Opsional: Handle jika token expired (401)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Jika 401, bisa redirect ke login atau hapus token
      // localStorage.removeItem("token");
      // window.location.href = "/admin/login";
    }
    return Promise.reject(error);
  }
);

export default api;