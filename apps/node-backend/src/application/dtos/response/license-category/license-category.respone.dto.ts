/**
 * DTO phản hồi thông tin hạng bằng lái, cung cấp dữ liệu tinh gọn cho Client.
 */
export class LicenseCategoryResponse {
  /** @property {string} id - Mã định danh duy nhất (UUID). */
  public readonly id!: string;

  /** @property {string} name - Tên hạng bằng (VD: A1, B2). */
  public readonly name!: string;

  /** @property {string} description - Mô tả chi tiết về hạng bằng. */
  public readonly description!: string;

  /** @property {string} createdAt - Thời điểm tạo bản ghi (định dạng ISO). */
  public readonly createdAt!: string;

  public readonly minAge!: number;
}