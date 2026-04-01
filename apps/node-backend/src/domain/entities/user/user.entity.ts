import { UserStatus } from "./user.status";
import { IUserProps } from "./user.props";
import { AppError, ErrorCode } from "@/shared/errors";
import { Role } from "@/domain/entities/role/role.entity";

export class User {
  /**
   * Để private constructor để ép buộc việc tạo Object qua Static Factory Methods.
   * Sử dụng giao diện IUserProps kết hợp với các thuộc tính bổ sung (như roles).
   */
  private constructor(
    private _props: IUserProps & { 
      roles: Role[]; 
      passwordHash: string 
    }
  ) {}

  // --- GETTERS ---
  // Truy cập tập trung vào object _props
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
  public get passwordHash(): string | undefined { return this._props.passwordHash; }
  public get roles(): Role[] { return [...this._props.roles]; }

  // --- STATIC FACTORY METHODS ---

  /** Tạo mới một User (Dùng cho logic Register/Sign up) */
  public static create(data: {
    id: string;
    username: string;
    email: string;
    fullName?: string;
    phoneNumber?: string;
    passwordHash: string;
  }): User {
    // Validation cơ bản (Nghiệp vụ Domain)
    if (!data.email.includes('@')) throw new Error("Email không hợp lệ");
    if (data.username.length < 3) throw new Error("Username quá ngắn");

    const now = new Date();
    
    return new User({
      id: data.id,
      username: data.username.trim().toLowerCase(),
      email: data.email.trim().toLowerCase(),
      fullName: data.fullName || null,
      phoneNumber: data.phoneNumber || null,
      status: 'active',
      urlPicture: null,
      deletedAt: null,
      createdAt: now,
      updatedAt: now,
      passwordHash: data.passwordHash,
      roles: [] // Mặc định chưa có role
    });
  }

  /** Tái tạo object từ Database (Dùng cho Repository/Mapper) */
  public static reconstitute(props: IUserProps & { roles?: Role[] }): User {
    return new User({
      ...props,
      roles: props.roles || []
    });
  }

  // --- DOMAIN LOGIC (Hành vi nghiệp vụ) ---

  public isActive(): boolean {
    return this._props.status === 'active' && !this.isDeleted();
  }

  public isDeleted(): boolean {
    return this._props.deletedAt !== null;
  }

  public isSuspended(): boolean {
    return this._props.status === 'suspended';
  }

  public get displayName(): string {
    return this._props.fullName || this._props.username;
  }

  // --- STATE MUTATION (Cập nhật trạng thái) ---

  private touch(): void {
    this._props.updatedAt = new Date();
  }

  public updateProfile(fullName?: string, urlPicture?: string): void {
    let hasChanged = false;

    if (fullName !== undefined && this._props.fullName !== fullName) {
      this._props.fullName = fullName;
      hasChanged = true;
    }

    if (urlPicture !== undefined && this._props.urlPicture !== urlPicture) {
      this._props.urlPicture = urlPicture;
      hasChanged = true;
    }

    if (hasChanged) this.touch();
  }

  public changeFullName(newName: string): void {
    const trimmedName = newName.trim();
    if (this._props.fullName === trimmedName) return;
    this._props.fullName = trimmedName;
    this.touch();
  }

  public updateStatus(newStatus: UserStatus): void {
    if (this._props.status === newStatus) return;
    this._props.status = newStatus;
    this.touch();
  }

  public suspend(): void {
    this.updateStatus('suspended');
  }

  public softDelete(): void {
    this._props.deletedAt = new Date();
    this.touch();
  }

  public restore(): void {
    if (!this.isDeleted()) return;
    this._props.deletedAt = null;
    this._props.status = 'active';
    this.touch();
  }

  public updateAvatar(newPath: string): void {
    if (this._props.urlPicture === newPath) return;
    this._props.urlPicture = newPath;
    this.touch();
  }

  // --- PASSWORD & SECURITY ---

  public async updatePassword(
    oldPasswordRaw: string,
    newPasswordHash: string,
    compareFn: (raw: string, hashed: string) => Promise<boolean>
  ): Promise<void> {
    if (!this._props.passwordHash) throw new AppError(ErrorCode.USER.NOT_FOUND);

    const isMatch = await compareFn(oldPasswordRaw, this._props.passwordHash);
    if (!isMatch) {
      throw new AppError(ErrorCode.VALIDATION.PASSWORD_DIFFERENT);
    }

    this._props.passwordHash = newPasswordHash;
    this.touch();
  }

  public resetPassword(newPasswordHash: string): void {
    this._props.passwordHash = newPasswordHash;
    this.touch();
  }

  // --- ROLE & PERMISSION ---

  public assignRole(role: Role): void {
    const exists = this._props.roles.find(r => r.id === role.id);
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

  public hasPermission(permissionName: string): boolean {
    return this._props.roles.some(role => role.hasPermission(permissionName));
  }

  public getAllPermissionNames(): string[] {
    const names = this._props.roles.flatMap(role =>
      role.permissions.map(p => p.name)
    );
    return [...new Set(names)];
  }
} 