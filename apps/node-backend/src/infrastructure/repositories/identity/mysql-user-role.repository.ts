import { IUserRoleRepository } from "@/domain/interfaces/repositories/identity/i-user-role.repository";
import { IUnitOfWork } from "@/domain/interfaces/seedwork";
import { Prisma } from "@prisma/client";

/**
 * @interface IMySQLUserRoleRepositoryCradle
 * @description Định nghĩa các phụ thuộc (dependencies) dành riêng cho User Role Repository thông qua Awilix Proxy.
 */
export interface IMySQLUserRoleRepositoryCradle {
  unitOfWork: IUnitOfWork;
}

/**
 * @class MySQLUserRoleRepository
 * @description Triển khai Repository xử lý các thao tác liên quan đến bảng trung gian giữa Người dùng và Vai trò.
 * Đảm bảo tính nhất quán tuyệt đối về kiểu dữ liệu (Zero-Any Architecture) và tích hợp Unit of Work cô lập.
 */
export class MySQLUserRoleRepository implements IUserRoleRepository {
  private readonly _uow: IUnitOfWork;

  /**
   * @description Khởi tạo Repository và nhận vào quản lý Unit of Work để chia sẻ context transaction an toàn.
   * @param {IMySQLUserRoleRepositoryCradle} cradle - Dependencies container được tiêm tự động từ Awilix.
   */
  constructor({ unitOfWork }: IMySQLUserRoleRepositoryCradle) {
    this._uow = unitOfWork;
  }

  /**
   * @description ĐÂY CHÍNH LÀ CHÌA KHÓA: Khai báo thuộc tính "client" động.
   * Mỗi khi trong hàm gọi "this.client", nó sẽ tự chạy lệnh lấy client mới nhất từ UoW.
   */
  private get client(): Prisma.TransactionClient {
    return this._uow.getContext() as Prisma.TransactionClient;
  }

  /**
   * @description Đồng bộ hóa danh sách vai trò của người dùng bằng thuật toán tính toán chênh lệch (Differential Calculation).
   * Tự động nhận diện ngữ cảnh transaction từ Unit of Work mà không làm rò rỉ cấu trúc Prisma ra tầng nghiệp vụ.
   * @param {string} userId - Định danh của người dùng cần đồng bộ vai trò.
   * @param {string[]} roleIds - Mảng chứa danh sách các mã vai trò mới mong muốn.
   * @returns {Promise<void>} Không trả về giá trị khi thực thi thành công.
   */
  public async syncUserRoles(userId: string, roleIds: string[]): Promise<void> {

    // 1. Lấy danh sách vai trò hiện tại từ DB để thực hiện đối chiếu
    const currentRecords = await this.client.userRole.findMany({
      where: { userId },
      select: { roleId: true },
    });

    const currentRoleIds: string[] = currentRecords.map((r) => r.roleId);

    // 2. Phân tách logic so sánh chênh lệch (Differential Calculation) nhằm tối ưu hóa số lượng câu lệnh I/O
    const rolesToRemove: string[] = currentRoleIds.filter(
      (id) => !roleIds.includes(id),
    );
    const rolesToAdd: string[] = roleIds.filter(
      (id) => !currentRoleIds.includes(id),
    );

    // Tổ chức mảng các tác vụ xử lý bất đồng bộ để sẵn sàng tối ưu hóa song song nếu cần
    const databaseOperations: Promise<unknown>[] = [];

    // 3. Chuẩn bị tác vụ xóa các liên kết cũ không còn xuất hiện trong danh sách mới
    if (rolesToRemove.length > 0) {
      databaseOperations.push(
        this.client.userRole.deleteMany({
          where: {
            userId,
            roleId: { in: rolesToRemove },
          },
        }),
      );
    }

    // 4. Chuẩn bị tác vụ thêm mới các liên kết vai trò chưa tồn tại trong hệ thống
    if (rolesToAdd.length > 0) {
      databaseOperations.push(
        this.client.userRole.createMany({
          data: rolesToAdd.map((roleId) => ({
            userId,
            roleId,
          })),
        }),
      );
    }

    // 5. Thực thi song song (Parallelism) các tác vụ ghi/xóa cơ sở dữ liệu nếu có thay đổi xảy ra
    if (databaseOperations.length > 0) {
      await Promise.all(databaseOperations);
    }
  }
}
