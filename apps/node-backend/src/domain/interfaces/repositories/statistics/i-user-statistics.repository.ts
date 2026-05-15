import { UserStatisticsEntity } from "@/domain/entities/statistics/user-statistics.entity";

/**
 * @interface IUserStatisticsRepository
 * @description Giao diện quản lý lưu trữ cho các chỉ số thống kê của người dùng (User Statistics).
 */
export interface IUserStatisticsRepository {
  /**
   * @description Khởi tạo bản ghi thống kê mới cho người dùng.
   * @param {UserStatisticsEntity} entity - Thực thể thống kê ban đầu.
   * @returns {Promise<UserStatisticsEntity>} Thực thể đã được khởi tạo.
   */
  create(entity: UserStatisticsEntity): Promise<UserStatisticsEntity>;

  /**
   * @description Lấy thông tin thống kê của một người dùng dựa trên userId.
   * @param {string} userId - Định danh người dùng.
   * @returns {Promise<UserStatisticsEntity | null>} Thực thể thống kê hoặc null.
   */
  findByUserId(userId: string): Promise<UserStatisticsEntity | null>;

  /**
   * @description Cập nhật các chỉ số thống kê (sau khi hoàn thành bài thi).
   * @param {UserStatisticsEntity} entity - Thực thể thống kê đã được cập nhật logic ở Domain.
   * @returns {Promise<UserStatisticsEntity>} Thực thể sau khi đã bền vững hóa dữ liệu.
   */
  update(entity: UserStatisticsEntity): Promise<UserStatisticsEntity>;
  
  /**
   * @description Phương thức cập nhật hoặc tạo mới dựa trên sự tồn tại của userId.
   * @param {UserStatisticsEntity} entity - Thực thể cần đồng bộ.
   */
  upsert(entity: UserStatisticsEntity): Promise<UserStatisticsEntity>;
}