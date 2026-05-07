import axios, {
  AxiosError,
  AxiosInstance,
  InternalAxiosRequestConfig,
  AxiosResponse
} from 'axios';
import { useUserStore } from '../store/user/user.store';
import { ENDPOINTS } from '@/constants/api-endpoints.constant';

// 1. Định nghĩa Type chặt chẽ - "Say NO to any"
interface CustomAxiosConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
  _ignoreError?: boolean;
}

interface PendingRequest {
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
}

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
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

// REQUEST INTERCEPTOR
axiosClient.interceptors.request.use(
  (config) => {
    const token = useUserStore.getState().accessToken;

    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
    }

    if (token && token !== 'undefined' && token !== 'null') {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// RESPONSE INTERCEPTOR
axiosClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as CustomAxiosConfig;

    if (!originalRequest || originalRequest._ignoreError) {
      return Promise.reject(error);
    }

    // 1. Network Error
    if (!error.response) {
      if (typeof window !== 'undefined') window.location.replace("/error/network");
      return Promise.reject(error);
    }
    const refreshClient = axios.create({
      baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/v1',
    });
    const { status } = error.response;

    // 2. Xử lý 401 - Silent Refresh với Hàng đợi
    if (status === 401 && !originalRequest._retry) {

      // Nếu đang có một request khác đang đi Refresh Token rồi
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
        const refreshToken = useUserStore.getState().refreshToken;

        if (!refreshToken) {
          handleForceLogout();
          return Promise.reject(error);
        }

        // Dùng axios instance mới để tránh loop interceptor
        const res = await refreshClient.post('/auth/refresh-token', {
          refreshToken
        });

        // Tùy cấu trúc API của Trinh (ở đây giả định res.data.data)
        const { accessToken, refreshToken: newRefreshToken } = res.data.data;

        // Cập nhật Store
        useUserStore.getState().setTokens(accessToken, newRefreshToken);

        // Giải phóng hàng đợi
        processQueue(null, accessToken);

        // Thử lại chính request này
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return axiosClient(originalRequest);

      } catch (refreshError) {
        processQueue(refreshError, null);
        handleForceLogout();
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // 3. Critical Errors (Giữ nguyên logic của Trinh)
    const criticalErrors = [403, 404, 500, 502, 503];
    if (criticalErrors.includes(status)) {
      if (typeof window !== 'undefined') window.location.replace(`/error/${status}`);
    }

    return Promise.reject(error);
  }
);

const handleForceLogout = () => {
  useUserStore.getState().logout();
  if (typeof window !== 'undefined') window.location.replace('/login');
};

export default axiosClient;