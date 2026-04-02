import { IPermissionProps } from "./permission.props";

/**
 * Thực thể Quyền hạn (Permission) trong hệ thống.
 */
export class Permission {
  /**
   * Private constructor để ép việc khởi tạo qua phương thức static (Factory/Reconstitute).
   */
  private constructor(private _props: IPermissionProps) {}

  // --- Getters: Truy xuất từ _props ---
  public get id(): string { return this._props.id; }
  public get name(): string { return this._props.name; }
  public get description(): string | null { return this._props.description; }

  /**
   * Tái tạo thực thể Permission từ dữ liệu thô (thường dùng trong Mapper).
   * @param props Dữ liệu thô từ Database hoặc API.
   */
  public static reconstitute(props: IPermissionProps): Permission {
    return new Permission({
      id: props.id,
      name: props.name,
      description: props.description ?? null,
    });
  }

  /**
   * Helper để lấy ra object dữ liệu phẳng (nếu cần).
   */
  public toProps(): IPermissionProps {
    return { ...this._props };
  }
}