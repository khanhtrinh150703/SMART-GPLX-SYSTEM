import { StandardResponse } from "@/types/common.type";
import axios, { AxiosError } from "axios";

export const getErrorMessage = (error: unknown): string => {
  // 1. Kiểm tra nếu là lỗi từ Axios
  if (axios.isAxiosError(error)) {
    // Ép kiểu data về StandardResponse<unknown> để lấy message
    const serverError = error as AxiosError<StandardResponse<unknown>>;
    
    // Ưu tiên message từ server trả về, nếu không có thì lấy message của Axios, cuối cùng là fallback
    return (
      serverError.response?.data?.message || 
      error.message || 
      "Lỗi kết nối đến máy chủ"
    );
  }

  // 2. Lỗi logic JavaScript thông thường
  if (error instanceof Error) {
    return error.message;
  }

  return "Đã xảy ra lỗi hệ thống không xác định";
};