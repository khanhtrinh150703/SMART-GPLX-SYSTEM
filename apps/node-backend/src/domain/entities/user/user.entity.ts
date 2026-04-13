import { UserStatus } from "./user.status";
import { IUserProps } from "./user.props";
import { AppError, ErrorCode } from "@/shared/errors";
import { Role } from "@/domain/entities/role/role.entity";

/**
 * @class User
 * @description Thực thể Người dùng (Aggregate Root).
 * Chứa đựng toàn bộ logic nghiệp vụ cốt lõi và quy tắc chuyển đổi trạng thái.
 */
export class User {
  /**
   * @description Dữ liệu nội tại của thực thể. 
   * Không cho phép truy cập trực tiếp từ bên ngoài để bảo vệ tính toàn vẹn.
   */
  private readonly _props: IUserProps & {
    roles: Role[];
    passwordHash: string;
  };

  private constructor(props: IUserProps & { roles: Role[]; passwordHash: string }) {
    this._props = props;
  }

  // --- GETTERS (Chỉ đọc) ---

  public get id(): string { return this._props.id; }
  public get username(): string { return this._props.username; }
  public get email(): string { return this._props.email; }
  public get fullName(): string | null { return this._props.fullName; }
  public get phoneNumber(): string | null { return this._props.phoneNumber; }
  public get status(): UserStatus { return this._props.status; }
  public get urlPicture(): string | null { return this._props.urlPicture; }
  public get createdAt(): Date { return this._props.createdAt; }
  public get updatedAt(): Date { return this._props.updatedAt; }
  public get deletedAt(): Date | null { return this._props.deletedAt; }
  public get passwordHash(): string { return this._props.passwordHash; }
  public get roles(): Role[] { return [...this._props.roles]; }

  public get displayName(): string {
    return this._props.fullName || this._props.username;
  }

  // --- STATIC FACTORY METHODS ---

  /**
   * @description Tạo mới một User hoàn toàn mới (Logic Đăng ký).
   */
  public static create(data: {
    id: string;
    username: string;
    email: string;
    fullName?: string;
    phoneNumber?: string;
    passwordHash: string;
  }): User {
    const now = new Date();
    // Validate email/username format sơ bộ tại đây nếu cần
    return new User({
      id: data.id,
      username: data.username.trim().toLowerCase(),
      email: data.email.trim().toLowerCase(),
      fullName: data.fullName?.trim() || null,
      phoneNumber: data.phoneNumber?.trim() || null,
      status: 'active',
      urlPicture: null,
      deletedAt: null,
      createdAt: now,
      updatedAt: now,
      passwordHash: data.passwordHash,
      roles: []
    });
  }

  /**
   * @description Tái tạo đối tượng từ dữ liệu Database.
   */
  public static reconstitute(props: IUserProps & { roles?: Role[]; passwordHash: string }): User {
    return new User({
      ...props,
      roles: props.roles || []
    });
  }

  // --- BUSINESS LOGIC (Nghiệp vụ) ---

  public isActive(): boolean {
    return this._props.status === 'active' && !this.isDeleted();
  }

  public isDeleted(): boolean {
    return this._props.deletedAt !== null;
  }

  public hasPermission(permissionName: string): boolean {
    return this._props.roles.some(role => role.hasPermission(permissionName));
  }

  /**
   * @description Lấy danh sách tên quyền hạn không trùng lặp từ tất cả vai trò.
   */
  public getAllPermissionNames(): string[] {
    const names = this._props.roles.flatMap(role =>
      role.permissions.map(p => p.name)
    );
    return [...new Set(names)];
  }

  // --- STATE MUTATION (Cập nhật trạng thái) ---

  /** @description Cập nhật dấu thời gian thay đổi cuối cùng. */
  private touch(): void {
    this._props.updatedAt = new Date();
  }

  /**
   * @description Cập nhật họ tên kèm validate. 
   * Thay thế cho changeFullName để tập trung logic.
   */
  public updateFullName(newName: string): void {
    if (!newName || newName.trim().length === 0) {
      throw new AppError(ErrorCode.USER.NAME_REQUIRED);
    }
    const trimmedName = newName.trim();
    if (trimmedName.length < 2) throw new AppError(ErrorCode.USER.NAME_TOO_SHORT);
    if (trimmedName.length > 100) throw new AppError(ErrorCode.USER.NAME_TOO_LONG);

    if (this._props.fullName !== trimmedName) {
      this._props.fullName = trimmedName;
      this.touch();
    }
  }

  /**
   * @description Cập nhật ảnh đại diện.
   */
  public updateAvatar(newPath: string): void {
    if (!newPath || newPath === this._props.urlPicture) return;
    this._props.urlPicture = newPath;
    this.touch();
  }

  /**
   * @description Cập nhật đồng thời thông tin cá nhân cơ bản.
   */
  public updateProfile(fullName?: string, urlPicture?: string): void {
    if (fullName !== undefined) this.updateFullName(fullName);
    if (urlPicture !== undefined) this.updateAvatar(urlPicture);
  }

  public updateStatus(newStatus: UserStatus): void {
    if (this._props.status === newStatus) return;
    this._props.status = newStatus;
    this.touch();
  }

  public suspend(): void {
    this.updateStatus('suspended');
  }

  /** @description Xóa mềm: Chuyển trạng thái sang locked và gán mốc thời gian xóa. */
  public softDelete(): void {
    this._props.status = 'locked';
    this._props.deletedAt = new Date();
    this.touch();
  }

  public restore(): void {
    if (!this.isDeleted()) return;
    this._props.deletedAt = null;
    this._props.status = 'active';
    this.touch();
  }

  // --- SECURITY & ROLES ---

  /**
   * @description Thay đổi mật khẩu có kiểm tra mật khẩu cũ.
   */
  public async updatePassword(
    oldPasswordRaw: string,
    newPasswordHash: string,
    compareFn: (raw: string, hashed: string) => Promise<boolean>
  ): Promise<void> {
    const isMatch = await compareFn(oldPasswordRaw, this._props.passwordHash);
    if (!isMatch) {
      throw new AppError(ErrorCode.AUTH.INVALID_CREDENTIALS); // Hoặc PASSWORD_DIFFERENT
    }
    this._props.passwordHash = newPasswordHash;
    this.touch();
  }

  /** @description Đặt lại mật khẩu (Dùng cho Admin hoặc Forgot Password). */
  public resetPassword(newPasswordHash: string): void {
    this._props.passwordHash = newPasswordHash;
    this.touch();
  }

  public assignRole(role: Role): void {
    const exists = this._props.roles.some(r => r.id === role.id);
    if (!exists) {
      this._props.roles.push(role);
      this.touch();
    }
  }

  public removeRole(roleId: string): void {
    const initialLength = this._props.roles.length;
    this._props.roles = this._props.roles.filter(r => r.id !== roleId);

    if (this._props.roles.length !== initialLength) {
      this.touch();
    }
  }
}