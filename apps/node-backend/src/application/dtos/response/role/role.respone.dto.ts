/**
 * @description Giao diện dữ liệu trả về cho thông tin Vai trò (Role).
 * (Interface for responding with Role information.)
 */
export interface IRoleResponseDTO {
  /** @description Mã định danh duy nhất của vai trò (UUID). (Unique identifier of the role.) */
  readonly id: string;

  /** @description Tên định danh kỹ thuật dùng cho logic check quyền (VD: 'ADMIN'). (Technical identifier name for permission logic.) */
  readonly name: string;

  /** @description Tên hiển thị thân thiện với người dùng. (User-friendly display name.) */
  readonly displayName?: string;
}

/**
 * @description DTO vận chuyển dữ liệu Vai trò ở mức độ thu gọn.
 * Cung cấp các thông tin cần thiết để hiển thị tên và phân quyền cơ bản trên giao diện dự án Smart-GPLX-System.
 */
export class RoleResponseDTO implements IRoleResponseDTO {
  public readonly id: string;
  public readonly name: string;
  public readonly displayName?: string;

  constructor(data: IRoleResponseDTO) {
    this.id = data.id;
    this.name = data.name;
    this.displayName = data.displayName;
  }
}