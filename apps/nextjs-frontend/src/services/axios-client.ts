import axios, {
  AxiosError,
  AxiosInstance,
  InternalAxiosRequestConfig,
  AxiosResponse,
} from "axios";
import { useUserStore } from "../store/user/user.store";

// 1. Định nghĩa Type chặt chẽ - "Say NO to any"
interface CustomAxiosConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
  _ignoreError?: boolean;
}

interface PendingRequest {
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
}

// Khởi tạo Client riêng cho Refresh để tránh bị Interceptor chính "tóm" được
// (Separate client for refreshing to avoid interceptor loops)
const refreshClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "/api/v1",
});

// 2. Biến kiểm soát trạng thái hàng đợi
let isRefreshing = false;
let failedQueue: PendingRequest[] = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((request) => {
    if (error) {
      request.reject(error);
    } else if (token) {
      request.resolve(token);
    }
  });
  failedQueue = [];
};

const axiosClient: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
});

// REQUEST INTERCEPTOR
axiosClient.interceptors.request.use(
  (config) => {
    const token = useUserStore.getState().accessToken;

    if (config.data instanceof FormData) {
      delete config.headers["Content-Type"];
    }

    if (token && token !== "undefined" && token !== "null") {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

// RESPONSE INTERCEPTOR
axiosClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as CustomAxiosConfig;

    // 🛡️ CẦU DAO CÁCH LY (CIRCUIT BREAKER)
    // Nếu không có config hoặc request bị chặn lỗi thì reject luôn
    if (!originalRequest || originalRequest._ignoreError) {
      return Promise.reject(error);
    }

    // 1. Network Error (Lỗi kết nối)
    if (!error.response) {
      if (typeof window !== "undefined")
        window.location.replace("/error/network");
      return Promise.reject(error);
    }

    const { status } = error.response;
    const authPath = "/auth/refresh-token";
    const loginPath = "/auth/login";
    // 2. Xử lý 401 - Silent Refresh
    // ĐIỀU KIỆN CHẶN LOOP: Không được retry nếu chính URL này là API Refresh
    if (
      status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url?.includes(authPath) &&
      !originalRequest.url?.includes(loginPath)
    ) {
      // Nếu đang có một request khác đang đi Refresh rồi, đưa mình vào hàng đợi
      if (isRefreshing) {
        return new Promise<string>((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return axiosClient(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const { refreshToken, clearLocalAuth, setTokens } =
          useUserStore.getState();

        if (!refreshToken) {
          clearLocalAuth();
          window.location.href = "/login";
          return Promise.reject(error);
        }

        // Gọi API Refresh (Dùng refreshClient đã tạo ở ngoài)
        const res = await refreshClient.post(authPath, { refreshToken });
        const { accessToken, refreshToken: newRefreshToken } = res.data.data;

        // Cập nhật Store & Cookies
        setTokens(accessToken, newRefreshToken);

        // Giải phóng các request đang chờ trong hàng đợi (Release the queue)
        processQueue(null, accessToken);

        // Thử lại chính request hiện tại
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return axiosClient(originalRequest);
      } catch (refreshError) {
        // Nếu refresh thất bại (Token hết hạn hoàn toàn), xóa sạch và đá ra ngoài
        processQueue(refreshError, null);
        useUserStore.getState().clearLocalAuth();
        window.location.href = "/login";
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // 3. Xử lý trường hợp chính API Refresh bị 401 (Trường hợp tử huyệt)
    if (status === 401 && originalRequest.url?.includes(authPath)) {
      useUserStore.getState().clearLocalAuth();
      window.location.href = "/login";
    }

    // 4. Critical Errors (Các lỗi nghiêm trọng khác)
    const criticalErrors = [403, 404, 500, 502, 503];
    if (criticalErrors.includes(status)) {
      if (typeof window !== "undefined")
        window.location.replace(`/error/${status}`);
    }

    return Promise.reject(error);
  },
);

// const handleForceLogout = () => {
//   useUserStore.getState().logout();
//   if (typeof window !== "undefined") window.location.replace("/login");
// };

export default axiosClient;
