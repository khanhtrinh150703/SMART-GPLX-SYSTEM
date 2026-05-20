/**
 * @description Giao diện trừu tượng quản lý Transaction (Unit of Work)
 */
export interface IUnitOfWork {
  /**
   * Thực thi một chuỗi các tác vụ bên trong một Transaction cô lập
   * @param work Hàm callback chứa các thao tác nghiệp vụ cần chạy trong transaction
   */
  runInTransaction<T>(work: () => Promise<T>): Promise<T>;

  /**
   * @description Lấy ra ngữ cảnh kết nối hiện tại (Đảm bảo tính trừu tượng tuyệt đối).
   */
  getContext(): unknown;
}
