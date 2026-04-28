/**
 * DTO phản hồi thông tin hạng bằng lái, cung cấp dữ liệu tinh gọn cho Client.
 * (DTO responding with license category info, providing lean data for the Client)
 */
export class LicenseCategoryResponse {
  /** @property {string} id - Mã định danh duy nhất (UUID). */
  public readonly id!: string;

  /** @property {string} name - Tên hạng bằng (VD: A1, B2). */
  public readonly name!: string;

  /** @property {string} description - Mô tả chi tiết về hạng bằng. */
  public readonly description!: string;

  /** @property {number} minAge - Độ tuổi tối thiểu bắt buộc để được cấp hạng bằng này. */
  public readonly minAge!: number;

  /** @property {string} status - Trạng thái hoạt động của hạng bằng (VD: active, draft, deleted). */
  public readonly status!: string;

  /** @property {string} createdAt - Thời điểm tạo bản ghi (định dạng ISO 8601). */
  public readonly createdAt!: string;
}