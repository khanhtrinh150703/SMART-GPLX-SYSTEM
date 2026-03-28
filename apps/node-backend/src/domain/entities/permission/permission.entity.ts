/**
 * @description Thực thể Quyền hạn (Permission) trong hệ thống
 */
export class Permission {
  private constructor(
    private readonly _id: string,
    private readonly _name: string,
    private readonly _description: string | null
  ) {}

  public get id(): string { return this._id; }
  public get name(): string { return this._name; }
  public get description(): string | null { return this._description; }

  /**
   * @description Tái tạo thực thể Permission từ dữ liệu thô
   * @param props Dữ liệu thô từ Database
   */
  public static reconstitute(props: { id: string; name: string; description?: string | null }): Permission {
    return new Permission(props.id, props.name, props.description || null);
  }
}