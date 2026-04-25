import { BaseEntity } from "@/domain/seedwork/entity.base";
import { Permission } from "../permission/permission.entity";
import { CreateRoleProps, IRoleProps } from "./role.props";

/**
 * @description Thực thể Vai trò (Role) - Quản lý nhóm các quyền hạn.
 */
export class Role extends BaseEntity<IRoleProps> {



  /**
   * @description Constructor đơn giản: Chỉ nhận dữ liệu đã được gọt giũa sạch sẽ.
   */
  private constructor(props: IRoleProps) {
    super(props);
    // this.validate(); // Kiểm tra tên Role không được trống, v.v.
  }

  /**
   * @description Factory Method: Khởi tạo một Role mới hoàn toàn.
   * Đây là nơi duy nhất thực hiện Normalization (gọt giũa) và sinh ID.
   */
  public static create(data: CreateRoleProps): Role {
    const finalizedProps: IRoleProps = {
      // Luôn sinh ID mới khi tạo mới
      id: crypto.randomUUID(),

      // Normalization: Gọt giũa văn bản
      name: data.name.trim(),
      description: data.description?.trim() || '',

      // Đảm bảo permissions luôn là một mảng thực thể hợp lệ
      permissions: data.permissions || [],
    };

    return new Role(finalizedProps);
  }

  /**
   * @description Tái tạo thực thể Role từ dữ liệu thô (thường là từ Database).
   * @param {IRoleProps} props - Dữ liệu thuộc tính.
   * @returns {Role}
   */
  public static reconstitute(props: IRoleProps): Role {
    return new Role(props);
  }

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
   * Trả về dữ liệu phẳng của Role (nếu cần dùng cho Mapper).
   */
  public toProps(): IRoleProps {
    return { ...this._props };
  }
}