import axios from 'axios';
import { useUserStore } from '../store/user/user.store';

const axiosClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

// 1. Request Interceptor: Giữ nguyên logic gắn Token
axiosClient.interceptors.request.use(
  (config) => {
    // 1. Lấy token từ Zustand Store
    const token = useUserStore.getState().accessToken;

    // 2. Xử lý gửi tệp tin (FormData)
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
    }

    // 3. Kiểm tra Token và nhét vào Headers
    // Kiểm tra đúng biến "token" vừa lấy ở trên
    if (token && token !== 'undefined' && token !== 'null') {
      // Gắn token vào thẻ Authorization (Nhớ có chữ Bearer đằng trước tùy backend yêu cầu)
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      // Bật dòng này lên nếu bạn muốn theo dõi xem có API nào đang gọi mà thiếu token không
      // console.warn("Axios Interceptor: Đang gửi API mà không có Token hợp lệ!");
    }

    // 4. QUAN TRỌNG NHẤT: Bắt buộc phải trả lại config để Axios chạy tiếp
    return config;
  },
  (error) => Promise.reject(error)
);

// 2. Response Interceptor: Nơi xử lý "Hồi sinh" Token
/**
 * Response Interceptor: Centralized Error Handling & Token Resurrection
 * (Bộ chặn phản hồi: Xử lý lỗi tập trung và Hồi sinh Token)
 */
axiosClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (originalRequest._ignoreError) {
      return Promise.reject(error);
    }

    // 1. Network Error handling (Xử lý mất mạng)
    if (!error.response) {
      window.location.replace("/error/network");
      return Promise.reject(error);
    }

    const { status } = error.response;

    // 2. Critical Infrastructure Errors (403, 404, 500...)
    const criticalErrors = [403, 404, 500, 502, 503];

    if (criticalErrors.includes(status)) {
      window.location.replace(`/error/${status}`);
      return Promise.reject(error);
    }

    // 3. Logic Silent Refresh (401)
    if (status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = useUserStore.getState().refreshToken;

        if (!refreshToken) {
          handleForceLogout();
          return Promise.reject(error);
        }

        // Gọi API Refresh với instance axios mới (không dùng interceptor này)
        const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/refresh-token`, {
          refreshToken
        });

        const { accessToken, refreshToken: newRefreshToken } = res.data.data;
        useUserStore.getState().setTokens(accessToken, newRefreshToken);

        // Thử lại request cũ với token mới
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return axiosClient(originalRequest);

      } catch (refreshError) {
        handleForceLogout();
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

const handleForceLogout = () => {
  useUserStore.getState().logout();
  // 💡 Ép về Login và xóa lịch sử để không Back lại Dashboard được
  window.location.replace('/login');
};

export default axiosClient;