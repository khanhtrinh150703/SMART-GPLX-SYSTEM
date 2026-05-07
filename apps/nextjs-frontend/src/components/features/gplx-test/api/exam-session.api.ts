import { ENDPOINTS } from "@/constants/api-endpoints.constant";
import axiosClient from "@/services/axios-client";
import { StandardResponse } from "@/types/common.type";
import {
  IActiveSessionResponseDTO,
  IStartSessionInputDTO,
  IUpdateAnswerInputDTO
} from "../types/active-session.types";

/**
 * Active Session API Service
 * (Dịch vụ API quản lý Phiên làm bài đang diễn ra)
 */
export const activeSessionApi = {
  /**
   * Start a trial session for Guest
   * (Khởi tạo phiên thi thử dành cho Khách - Không lưu vết lâu dài)
   */
  startGuest: async (dto: IStartSessionInputDTO): Promise<StandardResponse<IActiveSessionResponseDTO>> => {
    const response = await axiosClient.post<StandardResponse<IActiveSessionResponseDTO>>(
      `${ENDPOINTS.ACTIVE_SESSION.GUEST_START}`,
      dto
    );
    return response.data;
  },

  /**
   * Get the current ongoing session for logged-in user
   * (Lấy phiên làm bài hiện tại của người dùng đã đăng nhập)
   */
  getCurrent: async (): Promise<StandardResponse<IActiveSessionResponseDTO | null>> => {
    const response = await axiosClient.get<StandardResponse<IActiveSessionResponseDTO | null>>(
      `${ENDPOINTS.ACTIVE_SESSION.CURRENT}`
    );
    return response.data;
  },

  /**
   * Start an official session for Student
   * (Bắt đầu phiên thi chính thức cho Học viên - Có lưu Snapshot vào NoSQL)
   */
  startOfficial: async (dto: IStartSessionInputDTO): Promise<StandardResponse<IActiveSessionResponseDTO>> => {
    const response = await axiosClient.post<StandardResponse<IActiveSessionResponseDTO>>(
      `${ENDPOINTS.ACTIVE_SESSION.START}`,
      dto
    );
    return response.data;
  },

  /**
   * Sync/Backup a single answer to NoSQL in real-time
   * (Đồng bộ/Sao lưu từng đáp án lên NoSQL theo nhịp 10 giây hoặc khi có thay đổi)
   */
  sync: async (dto: IUpdateAnswerInputDTO): Promise<StandardResponse<void>> => {
    const response = await axiosClient.patch<StandardResponse<void>>(
      `${ENDPOINTS.ACTIVE_SESSION.SYNC}`,
      dto
    );
    return response.data;
  },


  /**
   * @description Gửi payload nộp bài thi cuối cùng
   */
  deleteCurrent: async (): Promise<StandardResponse<void>> => {
    // 1. Phải dùng phương thức .delete của axios
    const response = await axiosClient.delete<StandardResponse<void>>(
      `${ENDPOINTS.ACTIVE_SESSION.CURRENT}`
    );
    return response.data;
  }
};