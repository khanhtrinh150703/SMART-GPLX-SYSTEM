import axios from 'axios';

const axiosClient = axios.create({
  headers: {
    'Content-Type': 'application/json',
  },
  // Có thể thêm timeout (Thời gian chờ tối đa)
  timeout: 10000, 
});

// Bạn có thể thiết lập Interceptor tại đây để tự động đính kèm Token sau này
axiosClient.interceptors.request.use((config) => {
  // Logic lấy token từ localStorage hoặc Cookie nhét vào header sẽ nằm ở đây
  return config;
});

export default axiosClient;