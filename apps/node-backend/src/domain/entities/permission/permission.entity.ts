import { BaseEntity } from "@/domain/seedwork/entity.base";
import { CreatePermissionProps, IPermissionProps } from "./permission.props";

/**
 * @description Thực thể Quyền hạn (Permission) - Đơn vị nhỏ nhất trong hệ thống phân quyền.
 */
export class Permission extends BaseEntity<IPermissionProps> {

  /**
   * @description Constructor "câm": Chỉ nhận dữ liệu đã được gọt giũa.
   */
  private constructor(props: IPermissionProps) {
    super(props);
  }

  /**
   * @description Factory Method: Khởi tạo một Quyền mới (Permission).
   * Thực hiện gọt giũa văn bản và gán ID duy nhất.
   */
  public static create(props: CreatePermissionProps): Permission {
    const finalizedProps: IPermissionProps = {
      ...props,
      // Luôn sinh ID mới khi tạo mới
      id: crypto.randomUUID(),

      // Normalization: Dọn dẹp dữ liệu văn bản
      name: props.name.trim(),
      description: props.description?.trim() || null,
    };

    return new Permission(finalizedProps);
  }

  /**
   * @description Tái tạo thực thể từ Database hoặc dữ liệu thô.
   */
  public static reconstitute(props: IPermissionProps): Permission {
    return new Permission(props);
  }

  // --- Getters: Truy xuất từ _props ---
  public get id(): string { return this._props.id; }
  public get name(): string { return this._props.name; }
  public get description(): string | null { return this._props.description; }

}