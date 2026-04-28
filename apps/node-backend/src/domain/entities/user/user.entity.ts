import { UserStatus } from "./user.status";
import { IUserProps } from "./user.props";
import { AppError, ErrorCode } from "@/shared/errors";
import { Role } from "@/domain/entities/role/role.entity";
import { BaseEntity } from "@/domain/seedwork/entity.base";
import bcrypt from 'bcrypt';
import { AUTH_CONFIG } from "@/shared/config/auth.config";

/**
 * @description Định nghĩa nội bộ cho User Props bao gồm các quan hệ và dữ liệu nhạy cảm.
 * Tách biệt để dễ quản lý hơn so với việc khai báo inline.
 */
interface IUserDomainProps extends IUserProps {
  roles: Role[];
  passwordHash: string;
}

/**
 * @class User
 * @description Thực thể Người dùng (Aggregate Root).
 * Chứa đựng toàn bộ logic nghiệp vụ cốt lõi và quy tắc chuyển đổi trạng thái.
 */
export class User extends BaseEntity<IUserDomainProps> {

  private static readonly SALT_ROUNDS = AUTH_CONFIG.bcrypt;

  /**
   * @description Constructor đơn giản: Chỉ nhận dữ liệu đã "sạch".
   */
  private constructor(props: IUserProps) {
    super(props);
  }

  /**
   * @description Factory Method: Khai sinh một User mới.
   * Xử lý mã hóa mật khẩu và gọt giũa dữ liệu văn bản.
   */
  public static async create(data: {
    username: string;
    email: string;
    fullName: string;
    passwordPlain: string;
    phoneNumber?: string;
  }): Promise<User> {
    const now = new Date();

    // 1. Mã hóa mật khẩu (Logic nghiệp vụ khi tạo mới)
    const hashedPassword = await this._hashPassword(data.passwordPlain);

    // 2. Chuẩn hóa dữ liệu
    const finalizedProps: IUserProps = {
      id: crypto.randomUUID(),
      username: data.username.trim().toLowerCase(),
      email: data.email.trim().toLowerCase(),
      passwordHash: hashedPassword,

      fullName: data.fullName.trim(),
      phoneNumber: data.phoneNumber?.trim() || '',
      urlPicture: '',

      status: 'active',
      roles: [], // Mặc định chưa có role khi mới tạo (hoặc gán role mặc định ở Service)

      createdAt: now,
      updatedAt: now,
      deletedAt: undefined,
    };

    return new User(finalizedProps);
  }

  private static async _hashPassword(plainText: string): Promise<string> {
    return await bcrypt.hash(plainText, this.SALT_ROUNDS.saltRounds);
  }

  /**
   * @description Tái tạo đối tượng từ dữ liệu Database (Persistence Layer).
   */
  public static reconstitute(props: IUserDomainProps): User {
    return new User(props);
  }


  // --- GETTERS (Chỉ đọc) ---

  public get id(): string { return this._props.id; }
  public get username(): string { return this._props.username; }
  public get email(): string { return this._props.email; }
  public get fullName(): string { return this._props.fullName; }
  public get phoneNumber(): string { return this._props.phoneNumber; }
  public get status(): UserStatus { return this._props.status; }
  public get urlPicture(): string { return this._props.urlPicture; }
  public get createdAt(): Date { return this._props.createdAt; }
  public get updatedAt(): Date { return this._props.updatedAt; }
  public get deletedAt(): Date | undefined { return this._props.deletedAt; }
  public get passwordHash(): string { return this._props.passwordHash; }
  public get roles(): Role[] { return [...this._props.roles]; }
  public get displayName(): string {
    return this._props.fullName || this._props.username;
  }


  // --- BUSINESS LOGIC (Nghiệp vụ) ---

  /**
   * @description Trả về URL ảnh đại diện đầy đủ sau khi đã chuẩn hóa đường dẫn.
   * @param {string} baseUrl - URL cơ sở của hệ thống (ví dụ: http://localhost:3000).
   * @returns {string} URL hoàn chỉnh hoặc chuỗi rỗng nếu không có ảnh.
   */
  public getFullPictureUrl(baseUrl: string): string {
    const picturePath = this.props.urlPicture;
    if (!picturePath) return "";

    // Chuẩn hóa: thay thế backslash (\) bằng forward slash (/)
    const normalizedPath = picturePath.replace(/\\/g, '/');

    // Xử lý để tránh bị double slash (//) khi nối chuỗi
    const cleanBaseUrl = baseUrl.replace(/\/+$/, '');
    const cleanPath = normalizedPath.startsWith('/') ? normalizedPath : `/${normalizedPath}`;

    return `${cleanBaseUrl}${cleanPath}`;
  }
  
  public isActive(): boolean {
    return this._props.status === 'active' && !this.isDeleted();
  }

  public isDeleted(): boolean {
    return !!this.props.deletedAt;
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
   * @description Kiểm tra mật khẩu người dùng nhập vào có khớp với mã hóa trong hệ thống hay không.
   * @param {string} password - Mật khẩu thuần (plain text) cần kiểm tra.
   * @returns {Promise<boolean>} True nếu khớp, ngược lại false.
   */
  public async comparePassword(password: string): Promise<boolean> {
    // Sử dụng chuỗi rỗng nếu passwordHash null để tránh lỗi thư viện
    return await bcrypt.compare(password, this.passwordHash ?? '');
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
    this._props.deletedAt = undefined;
    this._props.status = 'active';
    this.touch();
  }

  // --- SECURITY & ROLES ---

  /**
   * @description Thay đổi mật khẩu có kiểm tra mật khẩu cũ.
   * Logic: Kiểm tra "Chìa cũ" khớp -> "Đánh chìa mới" -> Lưu.
   */
  public async updatePassword(
    oldPasswordRaw: string,
    newPasswordPlain: string,
    compareFn: (raw: string, hashed: string) => Promise<boolean>
  ): Promise<void> {
    // 1. Kiểm tra mật khẩu cũ xem có khớp với cái đang lưu trong DB không
    const isMatch = await compareFn(oldPasswordRaw, this._props.passwordHash);

    if (!isMatch) {
      throw new AppError(ErrorCode.AUTH.INVALID_CREDENTIALS);
    }

    // 2. Nếu khớp thì mới tiến hành băm (hash) mật khẩu mới
    const hashedPassword = await User._hashPassword(newPasswordPlain);

    // 3. Cập nhật vào Props và cập nhật thời gian thay đổi
    this._props.passwordHash = hashedPassword;
    this.touch(); // Cập nhật updatedAt
  }

  /** @description Đặt lại mật khẩu (Dùng cho Admin hoặc Forgot Password). */
  public async resetPassword(newPasswordPlain: string): Promise<void> {
    const hashedPassword = await User._hashPassword(newPasswordPlain);

    this._props.passwordHash = hashedPassword;
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