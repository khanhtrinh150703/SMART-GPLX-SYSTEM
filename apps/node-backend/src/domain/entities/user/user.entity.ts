import { UserStatus } from "./user.status"
import { IUserProps } from "./user.props";
import { AppError, ErrorCode } from "@/shared/errors";
import { Role } from "@/domain/entities/role/role.entity";

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
    private _roles: Role[] = []
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
  public get roles(): Role[] { return [...this._roles]; }
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
      data.passwordHash,
    );
  }

  /** Tái tạo object từ DB (Dùng cho Repository/Mapper) */
  public static reconstitute(props: IUserProps & { roles?: Role[] }): User {
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
      props.passwordHash ?? "",
      props.roles || []
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

  /**
     * Logic cập nhật thông tin cá nhân
     * @param {string} fullName - Họ tên mới
     * @param {string} urlPicture - Đường dẫn ảnh mới
     */
  public updateProfile(fullName?: string, urlPicture?: string): void {

    this._fullName = fullName ?? "";

    if (urlPicture !== undefined) {
      this._urlPicture = urlPicture;
    }
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

  /**
   * Kiểm tra tính hợp lệ của mật khẩu cũ và cập nhật mật khẩu mới.
   * @param {string} oldPasswordRaw - Mật khẩu cũ chưa hash.
   * @param {string} newPasswordHash - Mật khẩu mới đã được hash từ Infrastructure.
   * @param {Function} compareFn - Hàm so sánh hash.
   */
  public async updatePassword(
    oldPasswordRaw: string,
    newPasswordHash: string,
    compareFn: (raw: string, hashed: string) => Promise<boolean>
  ): Promise<void> {
    if (!this._passwordHash) throw new AppError(ErrorCode.USER.NOT_FOUND);

    const isMatch = await compareFn(oldPasswordRaw, this._passwordHash);
    if (!isMatch) {
      throw new AppError(ErrorCode.AUTH.INVALID_CREDENTIALS);
    }

    this._passwordHash = newPasswordHash;
  }

  /**
   * Đặt lại mật khẩu (Dùng cho Forgot Password - không cần mật khẩu cũ).
   */
  public resetPassword(newPasswordHash: string): void {
    this._passwordHash = newPasswordHash;
  }

  /**
   * @description Gán một vai trò mới cho người dùng
   * @param role Thực thể Role cần gán
   */
  public assignRole(role: Role): void {
    const exists = this._roles.find(r => r.id === role.id);
    if (!exists) {
      this._roles.push(role);
      this.touch();
    }
  }

  /**
   * @description Gỡ bỏ một vai trò khỏi người dùng
   * @param roleId ID của vai trò cần gỡ
   */
  public removeRole(roleId: string): void {
    this._roles = this._roles.filter(r => r.id !== roleId);
    this.touch();
  }

  /**
   * @description Kiểm tra người dùng có một quyền cụ thể nào đó không (vét cạn qua tất cả roles)
   * @param permissionName Tên quyền cần kiểm tra
   */
  public hasPermission(permissionName: string): boolean {
    return this._roles.some(role => role.hasPermission(permissionName));
  }

  /**
   * @description Lấy danh sách tất cả mã quyền duy nhất của User
   * @returns string[] ví dụ: ['user:create', 'post:delete']
   */
  public getAllPermissionNames(): string[] {
    const names = this._roles.flatMap(role =>
      role.permissions.map(p => p.name)
    );
    return [...new Set(names)]; // Loại bỏ trùng lặp
  }

  public updateAvatar(newPath: string): void {
    if (this._urlPicture === newPath) return;
    this._urlPicture = newPath;
    this.touch();
  }


  /**
   * Cập nhật riêng lẻ họ tên
   */
  public updateFullName(newName: string): void {
    const trimmedName = newName.trim();
    if (this._fullName === trimmedName) return;
    this._fullName = trimmedName;
    this.touch();
  }
}