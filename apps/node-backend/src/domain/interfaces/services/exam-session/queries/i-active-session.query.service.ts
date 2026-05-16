import { IActiveSessionResponseDTO } from "@/application/dtos/response/active-session/active-session.response.dto";

/**
 * @description Giao diện quản lý phiên làm bài (Session) và bản nháp (Draft) của người dùng.
 */
export interface IActiveSessionQueryService {
  /**
   * @description Lấy thông tin phiên làm bài hiện tại để phục hồi trạng thái giao diện (Resume UI).
   * @param {string} userId - ID người dùng.
   * @returns {Promise<IActiveSessionResponseDTO | null>}
   */
  getCurrentSession(userId: string): Promise<IActiveSessionResponseDTO | null>;
}
