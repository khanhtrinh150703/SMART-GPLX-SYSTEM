import { UserStatus } from "./user.status"
import { IUserProps } from "./user.props";

export class User {
  // Để tất cả là private để bảo vệ tính đóng gói (Encapsulation)
  private constructor(
    private readonly _id: string,
    private readonly _username: string,
    private readonly _email: string,
    private _fullName: string | null,
    private _status: UserStatus,
    private _urlPicture: string | null,
    private _deletedAt: Date | null,
    private readonly _createdAt: Date,
    private _updatedAt: Date, // Bỏ readonly để cập nhật khi thay đổi data
    private _passwordHash?: string,
  ) { }

  // --- GETTERS ---
  public get id(): string { return this._id; }
  public get username(): string { return this._username; }
  public get email(): string { return this._email; }
  public get fullName(): string | null { return this._fullName; }
  public get status(): UserStatus { return this._status; }
  public get urlPicture(): string | null { return this._urlPicture; }
  public get createdAt(): Date { return this._createdAt; }
  public get updatedAt(): Date { return this._updatedAt; }
  public get deletedAt(): Date | null { return this._deletedAt; }
  public get passwordHash(): string | undefined { return this._passwordHash; }

  // --- STATIC FACTORY METHODS ---

  /** Tạo mới một User (Dùng cho logic Register) */
  public static create(data: {
    id: string;
    username: string;
    email: string;
    fullName?: string;
    passwordHash?: string;
  }): User {
    // Thêm Validation cơ bản
    if (!data.email.includes('@')) throw new Error("Email không hợp lệ");
    if (data.username.length < 3) throw new Error("Username quá ngắn");

    const now = new Date();
    return new User(
      data.id,
      data.username.trim().toLowerCase(),
      data.email.trim().toLowerCase(),
      data.fullName || null,
      'active',
      null,
      null,
      now,
      now,
      data.passwordHash
    );
  }

  /** Tái tạo object từ DB (Dùng cho Repository/Mapper) */
  public static reconstitute(props: IUserProps): User {
    return new User(
      props.id,
      props.username,
      props.email,
      props.fullName,
      props.status,
      props.urlPicture,
      props.deletedAt,
      props.createdAt,
      props.updatedAt,
      props.passwordHash
    );
  }

  // --- DOMAIN LOGIC (Hành vi) ---

  public isActive(): boolean {
    return this._status === 'active' && !this.isDeleted();
  }

  public isDeleted(): boolean {
    return this._deletedAt !== null; // Fix lỗi logic: Có ngày xóa nghĩa là đã xóa
  }

  public restore(): void {
    if (!this.isDeleted()) return; // Nếu chưa xóa thì không cần hồi sinh

    this._deletedAt = null;   // Xóa bỏ timestamp ngày xóa
    this._status = 'active';  // Đưa trạng thái về active (tùy nghiệp vụ của bạn)
    this.touch();             // Cập nhật ngày thay đổi
  }

  // --- CẬP NHẬT TRẠNG THÁI (State Mutation) ---

  /** Cập nhật timestamp mỗi khi có thay đổi */
  private touch(): void {
    this._updatedAt = new Date();
  }

  public updateProfile(fullName: string, urlPicture: string): void {
    this._fullName = fullName;
    this._urlPicture = urlPicture;
    this.touch();
  }

  public updatePassword(newPasswordHash: string): void {
    this._passwordHash = newPasswordHash;
    this.touch();
  }
  public updateStatus(newStatus: UserStatus): void {
    this._status = newStatus;
  }

  public changeFullName(newName: string): void {
    this._fullName = newName;
    this.touch();
  }

  public suspend(): void {
    if (this._status === 'suspended') return;
    this._status = 'suspended';
    this.touch();
  }

  public softDelete(): void {
    this._deletedAt = new Date();
    this.touch();
  }

  public isSuspended(): boolean {
    return this._status === 'suspended';
  }

  public get displayName(): string {
    return this._fullName || this._username;
  }

}