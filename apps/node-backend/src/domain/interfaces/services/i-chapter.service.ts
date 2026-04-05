import { CreateChapterRequestDTO } from "@/application/dtos/request/chapter/create-chapter.request.dto";
import { UpdateChapterRequestDTO } from "@/application/dtos/request/chapter/update-chapter.request.dto";
import { ChapterResponseDTO } from "@/application/dtos/response/chapter/chapter.dto.respone";

/**
 * @description Interface điều phối các nghiệp vụ quản lý Chương lý thuyết (Chapter Domain).
 */
export interface IChapterService {

  /**
   * @description Lấy danh sách toàn bộ chương lý thuyết, sắp xếp theo thứ tự hiển thị.
   * @returns {Promise<ChapterResponseDTO[]>} Danh sách thực thể Chương lý thuyết.
   */
  getAllChapters(): Promise<ChapterResponseDTO[]>;

  /**
   * @description Tìm kiếm thông tin chi tiết của một chương theo mã định danh.
   * @param {string} id - ID của chương cần tìm.
   * @returns {Promise<Chapter>} Thực thể chương lý thuyết.
   */
  getChapterById(id: string): Promise<ChapterResponseDTO>;

  /**
   * @description Khởi tạo và lưu trữ một chương lý thuyết mới vào hệ thống.
   * @param {CreateChapterRequestDTO} dto - Dữ liệu khởi tạo chương.
   * @returns {Promise<void>}
   */
  createChapter(dto: CreateChapterRequestDTO): Promise<ChapterResponseDTO>;

  /**
   * @description Cập nhật thông tin chi tiết hoặc thay đổi thứ tự hiển thị của chương.
   * @param {UpdateChapterRequestDTO} dto - Dữ liệu cập nhật kèm ID định danh.
   * @returns {Promise<void>}
   */
  updateChapter(dto: UpdateChapterRequestDTO): Promise<ChapterResponseDTO>;

  /**
   * @description Xóa mềm chương lý thuyết khỏi hệ thống (Chỉ thực hiện khi không có câu hỏi liên quan).
   * @param {string} id - ID của chương cần xóa.
   * @returns {Promise<void>}
   */
  deleteChapter(id: string): Promise<void>;

  /**
   * @description Khôi phục chương lý thuyết đã bị xóa mềm trước đó.
   * @param {string} id - ID của chương cần khôi phục.
   * @returns {Promise<void>}
   */
  restoreChapter(id: string): Promise<ChapterResponseDTO>;

  exists(id: string): Promise<boolean>;
}