import { ChapterQueryDTO } from "@/application/dtos/request/chapter/chapter-query.request.dto";
import { IChapterResponseDTO } from "@/application/dtos/response/chapter/chapter.respone.dto";
import { ISelectionResponseDTO } from "@/application/dtos/response/shared/selection.response.dto";
import { PaginatedResult } from "@/shared/types/pagination.types";

export interface IChapterQueryService {
    /**
     * @description Truy xuất danh sách các chương học dưới dạng Selection (Value/Label) phục vụ hiển thị trên Dropdown/Select.
     * @returns {Promise<ISelectionResponseDTO[]>} Mảng các đối tượng chứa ID (Value) và Tên chương (Label).
     */
    getChapterSelections(): Promise<ISelectionResponseDTO[]>;

    /**
     * @description Lấy danh sách chương lý thuyết có phân trang, sắp xếp theo thứ tự hiển thị.
     * @param {ChapterQueryDTO} query - Tham số truy vấn bao gồm phân trang và bộ lọc.
     * @returns {Promise<PaginatedResult<IChapterResponseDTO>>} Kết quả phân trang chứa danh sách Chapter.
     */
    getPaginatedChapters(query: ChapterQueryDTO): Promise<PaginatedResult<IChapterResponseDTO>>

    /**
     * @description Tìm kiếm thông tin chi tiết của một chương theo mã định danh.
     * @param {string} id - ID của chương cần tìm.
     * @returns {Promise<IChapterResponseDTO>} Thực thể chương lý thuyết.
     */
    getChapterById(id: string): Promise<IChapterResponseDTO>;
}
