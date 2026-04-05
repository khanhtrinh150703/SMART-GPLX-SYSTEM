import { Permission } from "../permission/permission.entity";
import { IRoleProps } from "./role.props";

/**
 * Thực thể Vai trò (Role), chứa danh sách các Quyền hạn.
 */
export class Role {
  /**
   * Private constructor để ép việc khởi tạo qua phương thức static.
   */
  private constructor(private _props: IRoleProps) {}

  // --- Getters: Truy xuất tập trung từ _props ---
  public get id(): string { return this._props.id; }
  public get name(): string { return this._props.name; }
  public get description(): string { return this._props.description; }
  public get permissions(): Permission[] { return this._props.permissions; }

  /**
   * Kiểm tra Role này có chứa một quyền cụ thể hay không.
   * @param permissionName Tên quyền (vd: 'user:write')
   */
  public hasPermission(permissionName: string): boolean {
    return this._props.permissions.some(p => p.name === permissionName);
  }

  /**
   * Tái tạo thực thể Role từ dữ liệu thô hoặc kết quả truy vấn Database.
   * @param props Dữ liệu thuộc tính của Role.
   */
  public static reconstitute(props: IRoleProps): Role {
    return new Role({
      id: props.id,
      name: props.name,
      description: props.description,
      permissions: props.permissions || [],
    });
  }

  /**
   * Trả về dữ liệu phẳng của Role (nếu cần dùng cho Mapper).
   */
  public toProps(): IRoleProps {
    return { ...this._props };
  }
}