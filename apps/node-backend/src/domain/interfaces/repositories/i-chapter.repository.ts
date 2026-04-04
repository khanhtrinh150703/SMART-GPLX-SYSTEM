import { Chapter } from "@/domain/entities/chapter/chapter.entity";

/**
 * @description Giao diện định nghĩa các thao tác truy vấn và bền vững hóa dữ liệu cho Chương lý thuyết (Chapter).
 * Đóng vai trò là lớp trừu tượng (Abstraction) ngăn cách giữa tầng nghiệp vụ và cơ sở dữ liệu.
 */
export interface IChapterRepository {
  /** * @description Truy vấn danh sách toàn bộ chương lý thuyết chưa bị xóa, sắp xếp theo thứ tự hiển thị (orderIndex).
   * @returns {Promise<Chapter[]>} Danh sách thực thể Chương lý thuyết.
   */
  findAll(): Promise<Chapter[]>;

  /** * @description Tìm kiếm một chương lý thuyết đang hoạt động dựa trên mã định danh (ID).
   * @param {string} id - UUID của chương cần tìm.
   * @returns {Promise<Chapter | null>} Thực thể chương hoặc null nếu không tồn tại.
   */
  findById(id: string): Promise<Chapter | null>;

  /** * @description Truy vấn thông tin chương lý thuyết bao gồm cả các bản ghi đã bị xóa mềm.
   * Thường được sử dụng trong quy trình kiểm tra dữ liệu lịch sử hoặc khôi phục (Restore).
   * @param {string} id - UUID của chương cần truy vấn.
   * @returns {Promise<Chapter | null>}
   */
  findByIdIncludingDeleted(id: string): Promise<Chapter | null>;

  /** * @description Tìm kiếm chương lý thuyết dựa trên tên định danh (Dùng để kiểm tra tính duy nhất).
   * @param {string} name - Tên chương cần kiểm tra.
   * @returns {Promise<Chapter | null>}
   */
  findByName(name: string): Promise<Chapter | null>;

  /** * @description Lưu trữ một thực thể chương lý thuyết mới vào hệ thống.
   * @param {Chapter} chapter - Thực thể Domain Chapter cần persist.
   * @returns {Promise<void>}
   */
  save(chapter: Chapter): Promise<void>;

  /** * @description Đồng bộ hóa các thay đổi của thực thể chương lý thuyết vào cơ sở dữ liệu.
   * @param {Chapter} chapter - Thực thể chứa các thông tin đã cập nhật.
   * @returns {Promise<void>}
   */
  update(chapter: Chapter): Promise<void>;

  /** * @description Thống kê số lượng câu hỏi đang liên kết với chương này.
   * Dùng để kiểm tra ràng buộc toàn vẹn dữ liệu trước khi thực hiện xóa.
   * @param {string} id - UUID của chương cần thống kê.
   * @returns {Promise<number>} Số lượng câu hỏi tìm thấy.
   */
  countQuestions(id: string): Promise<number>;

  /**
   * @description Khôi phục chương lý thuyết đã bị xóa mềm bằng cách gỡ bỏ đánh dấu thời gian xóa (deletedAt).
   * @param {string} id - UUID của chương cần khôi phục.
   * @returns {Promise<void>}
   */
  restore(id: string): Promise<void>;

  exists(id: string): Promise<boolean>;
}