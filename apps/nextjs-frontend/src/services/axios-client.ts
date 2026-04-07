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
axiosClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Kiểm tra nếu không có response (Lỗi mạng thực sự)
    if (!error.response) {
      console.error("LỖI MẠNG HOẶC CORS:", error.message);
      return Promise.reject(error);
    }

    /**
     * Logic Silent Refresh:
     * 1. Lỗi 401 (Unauthorized)
     * 2. Request này chưa từng được thử refresh trước đó (_retry = true)
     */
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; // Đánh dấu để tránh lặp vô hạn

      try {
        const refreshToken = useUserStore.getState().refreshToken;

        // Nếu không có cả Refresh Token thì "tiễn khách" luôn
        if (!refreshToken) {
          useUserStore.getState().logout();
          return Promise.reject(error);
        }

        // Gọi API Refresh (Dùng chính axiosClient hoặc một instance axios mới để tránh dính Interceptor)
        const res = await axios.post(`${axiosClient.defaults.baseURL}/auth/refresh-token`, {
          refreshToken: refreshToken
        });

        // Bóc tách theo cấu trúc data.data mà mình đã chốt
        const { accessToken, refreshToken: newRefreshToken } = res.data.data;

        // Cập nhật vào Store
        useUserStore.getState().setTokens(accessToken, newRefreshToken);

        // Gắn token mới vào request cũ và gọi lại
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return axiosClient(originalRequest);

      } catch (refreshError) {
        // Nếu refresh cũng lỗi (hết hạn nốt) -> Logout sạch sẽ
        console.error("Refresh token expired or invalid");
        useUserStore.getState().logout();
        window.location.href = '/login'; // Ép về trang login
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosClient;