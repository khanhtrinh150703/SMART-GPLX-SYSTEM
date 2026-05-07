import { SyncRankRequestDTO } from "@/application/dtos/request/user-rank/user-rank.request.dto";

/**
 * @description Giao diện xử lý logic nghiệp vụ cho bảng xếp hạng.
 */
export interface IUserExamRankService {
  /**
   * @description Đồng bộ hóa kỷ lục sau khi hoàn thành bài thi.
   * @param request Dữ liệu kết quả thi vừa thực hiện.
   */
  syncRank(request: SyncRankRequestDTO): Promise<void>;
}