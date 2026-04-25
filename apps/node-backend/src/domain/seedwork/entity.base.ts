/**
 * @description Interface bắt buộc cho mọi bộ Props.
 * Đảm bảo mọi thực thể tối thiểu phải có định danh ID.
 */
export interface IBaseProps {
  id?: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
}

/**
 * @description Lớp cơ sở trừu tượng cho mọi thực thể trong hệ thống.
 * @template T - Kiểu dữ liệu Props, bắt buộc phải kế thừa từ IBaseProps.
 */
export abstract class BaseEntity<T extends IBaseProps> {
  /**
   * @description Dữ liệu nội tại của thực thể. 
   * Dùng 'readonly' để đảm bảo tính bất biến (Immutability).
   */
  protected  _props: T;

  /**
   * @description Protected constructor để các lớp con có thể gọi super().
   */
  protected constructor(props: T) {
    this._props = { ...props };
  }

  /**
   * @description Truy xuất ID một cách an toàn. 
   * Nhờ Generic Constraint 'extends IBaseProps', TS biết chắc chắn T có trường id.
   */
  public get id(): string | undefined {
    return this._props.id;
  }

  /**
   * @description Trả về bản sao đóng băng của Props.
   * Ngăn chặn mọi hành vi chỉnh sửa trực tiếp dữ liệu từ bên ngoài.
   */
  public get props(): Readonly<T> {
    return Object.freeze({ ...this._props });
  }
}