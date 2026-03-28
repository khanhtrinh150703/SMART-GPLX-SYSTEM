import { Permission } from "../permission/permission.entity";

/**
 * @description Thực thể Vai trò (Role), chứa danh sách các Quyền hạn
 */
export class Role {
  private constructor(
    private readonly _id: string,
    private readonly _name: string,
    private readonly _description: string,
    private _permissions: Permission[]
  ) {}

  public get id(): string { return this._id; }
  public get name(): string { return this._name; }
  public get description(): string { return this._description; }
  public get permissions(): Permission[] { return this._permissions; }


  /**
   * @description Kiểm tra Role này có chứa một quyền cụ thể hay không
   * @param permissionName Tên quyền (vd: 'user:write')
   */
  public hasPermission(permissionName: string): boolean {
    return this._permissions.some(p => p.name === permissionName);
  }

  /**
   * @description Tái tạo thực thể Role
   */
  public static reconstitute(props: { 
    id: string; 
    name: string; 
    description: string;
    permissions?: Permission[] 
  }): Role {
    return new Role(props.id, props.name, props.description, props.permissions || []);
  }
}