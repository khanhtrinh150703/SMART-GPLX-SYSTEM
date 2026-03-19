import { UserStatus } from "../constants/UserStatus";
import { IUserProps } from "../interfaces/IUserProps";

// 2. Class User Entity
export class User {
  private constructor(
    public readonly id: string,
    public readonly username: string,
    public readonly email: string,
    private _fullName: string | null,
    private _status: UserStatus,
    public  urlPicture: string | null,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
    private _passwordHash?: string
  ) {}

  // 3. Static Factory Method: Giúp việc tạo object tường minh hơn
  public static create(data: {
    id: string;
    username: string;
    email: string;
    fullName?: string;
    passwordHash?: string
  }): User {
    // Bạn có thể thêm logic validation ở đây trước khi khởi tạo
    const now = new Date();
    return new User(
      data.id,
      data.username,
      data.email,
      data.fullName ?? null,
      'active', // Default status
      null,
      now,
      now,
      data.passwordHash
    );
  }
  
  // Dùng riêng cho Mapper/Repository để tái tạo object từ DB
  public static reconstitute(props: IUserProps): User {
    return new User(
      props.id,
      props.username,
      props.email,
      props.fullName,
      props.status,
      props.urlPicture,
      props.createdAt,
      props.updatedAt,
      props.passwordHash // Có thể đưa vào nếu cần check login
    );
  }

  // 4. Domain Logic (Hành vi của đối tượng)
  public isActive(): boolean {
    return this._status === 'active';
  }

  public get displayName(): string {
    return this._fullName || this.username;
  }

  // 5. Cập nhật thông tin qua các phương thức (Encapsulation)
  public updateProfile(fullName: string, urlPicture: string): void {
    this._fullName = fullName;
    this.urlPicture = urlPicture;
    // Cập nhật updatedAt tự động hoặc thông qua logic riêng
  }

  public suspend(): void {
    if (this._status === 'suspended') return;
    this._status = 'suspended';
  }

  public get passwordHash(): string | undefined {
    return this._passwordHash;
  }
}

export { UserStatus };
