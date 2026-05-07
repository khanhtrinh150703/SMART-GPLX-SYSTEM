import { ActiveSessionEntity } from "@/domain/entities/active-session/active-session.entity";

/**
 * @interface IActiveSessionRepository
 * @description Hợp đồng cho các thao tác dữ liệu liên quan đến phiên làm bài (Draft) trong NoSQL.
 * Tuyệt đối không sử dụng 'any', đảm bảo tính toàn vẹn dữ liệu.
 */
export interface IActiveSessionRepository {
  /**
   * @description Khởi tạo một phiên làm bài mới cho người dùng.
   * @param entity - Thực thể phiên làm bài nháp.
   */
  createActiveSession(entity: ActiveSessionEntity): Promise<void>;

  /**
   * @description Cập nhật tiến trình làm bài (danh sách câu trả lời nháp).
   * @param entity - Thực thể chứa dữ liệu đã cập nhật.
   */
  updateActiveSession(entity: ActiveSessionEntity): Promise<void>;

  /**
   * @description Tìm kiếm phiên làm bài hiện tại dựa trên ID người dùng.
   * @param userId - ID của người dùng đang làm bài.
   * @returns Trả về ActiveSessionEntity hoặc null nếu không tìm thấy.
   */
  findByUserId(userId: string): Promise<ActiveSessionEntity | null>;

  /**
   * @description Tìm kiếm phiên làm bài theo ID cụ thể.
   * @param id - ID của phiên làm bài.
   */
  findById(id: string): Promise<ActiveSessionEntity | null>;

  /**
   * @description Xóa bỏ phiên làm bài sau khi đã nộp bài thành công hoặc hết hạn.
   * @param id - ID user.
   */
  deleteByUserId(id: string): Promise<void>;
}