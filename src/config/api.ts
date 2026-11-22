// Ganti alamat IP ini dengan IPv4 laptop Anda (cek lewat perintah ipconfig di CMD)
// Pastikan HP dan laptop terhubung ke jaringan Wi-Fi yang sama.
// Di Expo Web (browser laptop) boleh memakai 127.0.0.1 sementara.
export const API_BASE_URL = "http://192.168.10.22:8000/api";

export const API_ENDPOINTS = {
  HEALTH: `${API_BASE_URL}/health`,
  LOGIN: `${API_BASE_URL}/login`,
  REGISTER: `${API_BASE_URL}/register`,
  PROFILE: `${API_BASE_URL}/profile`,
  LOGOUT: `${API_BASE_URL}/logout`,
};
