import { CreateChapterRequestDTO } from "@/application/dtos/request/chapter/create-chapter.request.dto";
import { UpdateChapterRequestDTO } from "@/application/dtos/request/chapter/update-chapter.request.dto";
import { IChapterResponseDTO } from "@/application/dtos/response/chapter/chapter.respone.dto";
import { IDeleteResponseDTO } from "@/application/dtos/response/shared/delete.response.dto";

/**
 * @description Interface điều phối các nghiệp vụ quản lý Chương lý thuyết (Chapter Domain).
 */
export interface IChapterService {

  /**
   * @description Khởi tạo và lưu trữ một chương lý thuyết mới vào hệ thống.
   * @param {CreateChapterRequestDTO} dto - Dữ liệu khởi tạo chương.
   * @returns {Promise<IChapterResponseDTO>}
   */
  createChapter(dto: CreateChapterRequestDTO): Promise<IChapterResponseDTO>;

  /**
   * @description Cập nhật thông tin chi tiết hoặc thay đổi thứ tự hiển thị của chương.
   * @param {string} id - ID của chuong.
   * @param {UpdateChapterRequestDTO} dto - Dữ liệu cập nhật kèm ID định danh.
   * @returns {Promise<void>}
   */
  updateChapter(id: string, dto: UpdateChapterRequestDTO): Promise<IChapterResponseDTO>;

  /**
   * @description Xóa chương lý thuyết.
   * @param {string} id - ID của chương cần xóa.
   * @returns {Promise<IDeleteResponseDTO>}
   */
  deleteChapter(id: string): Promise<IDeleteResponseDTO>

  /**
   * @description Khôi phục chương lý thuyết đã bị xóa mềm trước đó.
   * @param {string} id - ID của chương cần khôi phục.
   * @returns {Promise<IChapterResponseDTO>}
   */
  restoreChapter(id: string): Promise<IChapterResponseDTO>;

  /**
   * @description Kiểm tra sự tồn tại của một bản ghi trong hệ thống dựa trên ID.
   * @param {string} id - Mã định danh duy nhất của bản ghi cần kiểm tra.
   * @returns {Promise<boolean>} Trả về `true` nếu bản ghi tồn tại, ngược lại trả về `false`.
   */
  exists(id: string): Promise<boolean>;
}