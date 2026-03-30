import axios from 'axios';
import { useUserStore } from '../store/user/user.store';

/** * Axios Client: Cấu hình trung tâm cho các yêu cầu HTTP. */
const axiosClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

/** * Request Interceptor (Trình chặn yêu cầu):
 * Tự động kiểm tra và đính kèm Access Token vào Header trước khi gửi đi.
 */
axiosClient.interceptors.request.use(
  (config) => {
    // Lấy token trực tiếp từ Zustand Store (Truy cập RAM cực nhanh)
    const token = useUserStore.getState().accessToken;

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/** * Response Interceptor (Trình chặn phản hồi):
 * Xử lý các lỗi hệ thống như 401 (Hết hạn token) tập trung tại đây.
 */
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Logic: Logout hoặc Refresh Token tại đây
      console.error("Phiên đăng nhập hết hạn (Unauthorized)");
    }
    return Promise.reject(error);
  }
);

axiosClient.interceptors.request.use((config) => {
  // 💡 Nếu gửi FormData, hãy ĐỂ TRÌNH DUYỆT tự quyết định Content-Type
  // Đừng để Axios tự thêm 'application/json' vào.
  if (config.data instanceof FormData) {
    if (config.headers) {
      delete config.headers['Content-Type'];
    }
  }
  return config;
});

export default axiosClient;