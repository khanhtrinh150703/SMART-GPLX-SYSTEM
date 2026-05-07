import { AppError, ErrorCode } from "@/shared/errors";
import { UserStatus } from "@/domain/entities/user/user.status";
import { User } from "@/domain/entities/user/user.entity";
import { IUserRepository } from "@/domain/interfaces/repositories/identity/i-user.repository";
import { ITokenManager } from "@/domain/interfaces/services/external/i-token-manager.service";
import { UserRole } from "@/domain/constants/roles.constant";
import { IUserService } from "@/domain/interfaces/services/identity/i-user.service";
import { UserMapper } from "@/infrastructure/database/mappers/identity/user.mapper";
import { STORAGE_FOLDERS } from "@/domain/constants/storage.constant";
import { IUserRoleRepository } from "@/domain/interfaces/repositories/identity/i-user-role.repository";
import { PrismaClient } from "@prisma/client";
import { IMediaService } from "@/domain/interfaces/services/integration/i-media.service";
import { IMasterDataCacheService } from "@/domain/interfaces/services/exam-mgmt/i-master-data-cache.service";
import { Role } from "@/domain/entities/role/role.entity";
import { UpdateAdminRequestDTO } from "@/application/dtos/request/user/update-admin.request.dto";
import { ChangePasswordRequestDTO } from "@/application/dtos/request/user/update-password.request.dto";
import { UpdateProfileRequestDTO } from "@/application/dtos/request/user/update-profile.request.dto";
import { ChangeStatusRequestDTO } from "@/application/dtos/request/user/update-status.request.dto";
import { ILoginResponseDTO } from "@/application/dtos/response/auth/auth.respone.dto";
import bcrypt from "bcrypt";
import { IUserResponseDTO } from "@/application/dtos/response/user/user.respone.dto";
import {
  IDeleteResponseDTO,
  DeleteResponseDTO,
} from "@/application/dtos/response/shared/delete.response.dto";
import { DeleteType } from "@/domain/constants/delete.constant";
import { ILogger } from "@/domain/interfaces/logging/i-logger.interface"; /**

/**
 * @interface IUserServiceCradle
 * @description Tập hợp các phụ thuộc (Dependencies) cần thiết cho UserService.
 * Bao gồm các cổng truy xuất dữ liệu, bảo mật và lưu trữ tập tin.
 */
export interface IUserServiceCradle {
  /** @description Repository quản lý các thao tác CRUD cơ bản trên thực thể Người dùng. */
  userRepository: IUserRepository;

  /** @description Repository chuyên biệt để quản lý mối quan hệ giữa Người dùng và Vai trò. */
  userRoleRepository: IUserRoleRepository;

  /** @description Dịch vụ quản lý vòng đời và mã hóa các loại Token (Access/Refresh). */
  tokenManager: ITokenManager;

  /** @description Dịch vụ xử lý lưu trữ và quản lý đường dẫn tập tin đa phương tiện. */
  mediaService: IMediaService;

  /** @description Dịch vụ truy xuất dữ liệu danh mục từ bộ nhớ đệm (Cache). */
  masterDataCacheService: IMasterDataCacheService;

  /** @description Instance Prisma dùng để thực hiện Transaction và truy vấn DB trực tiếp. */
  prisma: PrismaClient;

  /** @description Dịch vụ ghi log để theo dõi hoạt động và hỗ trợ gỡ lỗi hệ thống. */
  logger: ILogger;
}

/**
 * @class UserService
 * @description Xử lý các nghiệp vụ lõi liên quan đến Người dùng (User Domain).
 * Đóng vai trò Orchestrator điều phối giữa các lớp dữ liệu, bảo mật và hạ tầng lưu trữ.
 */
export class UserService implements IUserService {
  /** @private @readonly @description Repository người dùng. */
  private readonly _userRepo: IUserRepository;

  /** @private @readonly @description Repository vai trò người dùng. */
  private readonly _userRoleRepo: IUserRoleRepository;

  /** @private @readonly @description Trình quản lý Token bảo mật. */
  private readonly _tokenManager: ITokenManager;

  /** @private @readonly @description Dịch vụ xử lý Media (Ảnh đại diện, tài liệu). */
  private readonly _mediaService: IMediaService;

  /** @private @readonly @description Dịch vụ cache dữ liệu hệ thống. */
  private readonly _cacheService: IMasterDataCacheService;

  /** @private @readonly @description Client điều phối giao dịch Prisma. */
  private readonly _prisma: PrismaClient;

  /** @private @readonly @description Dịch vụ ghi log hệ thống. */
  private readonly _logger: ILogger;

  /**
   * @constructor
   * @description Khởi tạo Service với các phụ thuộc được tiêm (inject) từ DI Container.
   * @param {IUserServiceCradle} cradle - Chứa danh sách đầy đủ các Repository và Service bổ trợ.
   */
  constructor({
    userRepository,
    userRoleRepository,
    tokenManager,
    mediaService,
    masterDataCacheService,
    prisma,
    logger,
  }: IUserServiceCradle) {
    this._userRepo = userRepository;
    this._userRoleRepo = userRoleRepository;
    this._tokenManager = tokenManager;
    this._mediaService = mediaService;
    this._cacheService = masterDataCacheService;
    this._prisma = prisma;
    this._logger = logger;
  }

  /**
   * @description Thực hiện cập nhật hồ sơ người dùng (Dịch: Update user profile logic)
   * @param {string} userId - ID của người dùng cần cập nhật
   * @param {UpdateProfileRequestDTO} dto - Dữ liệu yêu cầu từ Client
   * @returns {Promise<ILoginResponseDTO>} DTO phản hồi sau khi cập nhật thành công
   */
  public async updateProfile(
    userId: string,
    dto: UpdateProfileRequestDTO,
  ): Promise<ILoginResponseDTO> {
    // 1. Lấy Entity từ Database (Dịch: Fetch entity from DB)
    const user = await this.getActiveUserOrThrow(userId);

    const oldPicturePath = user.props.urlPicture; // Truy cập qua props cho đúng chuẩn DDD
    let newUrlPicture: string | undefined;

    // 2. Xử lý File nếu có (Dịch: Handle file upload if exists)
    if (dto.pictureFile) {
      newUrlPicture = await this._mediaService.save(
        dto.pictureFile,
        STORAGE_FOLDERS.PROFILE,
      );
    }

    // 3. Thực hiện logic nghiệp vụ tại Entity (Rich Domain Model)
    // (Dịch: Mô hình Domain giàu tính năng - chứa logic thay vì chỉ chứa dữ liệu)
    user.updateProfile(dto.fullName, newUrlPicture);

    // 4. Persistence - Lưu vào Database (Dịch: Tầng lưu trữ dữ liệu vĩnh viễn)
    const updatedUser = await this._userRepo.updateUser(user);
    if (!updatedUser) throw new AppError(ErrorCode.SYSTEM.DATABASE_ERROR);

    // 5. Cleanup - Xóa ảnh cũ nếu upload thành công (Dịch: Dọn dẹp tài nguyên)
    if (newUrlPicture && oldPicturePath) {
      // Thực hiện xóa file cũ và bắt lỗi để tránh treo luồng chính
      this._mediaService.deleteFile(oldPicturePath).catch((err: unknown) => {
        this._logger.error(`[Cleanup_Error] Không thể xóa ảnh cũ`, {
          path: oldPicturePath,
          error: err instanceof Error ? err.message : String(err),
          stack: err instanceof Error ? err.stack : undefined,
          context: "UserAvatarCleanup",
        });
      });
    }

    // 6. Refresh Session (Single Session Policy)
    await this._tokenManager.revokeTokenByPattern(updatedUser.id);
    const tokens = await this._tokenManager.generateAndStoreTokens(updatedUser);

    // 7. Mapping kết quả từ updatedUser (Source of Truth)
    return UserMapper.toLoginResponse(updatedUser, tokens);
  }

  /**
   * @description API dành cho Admin cập nhật thông tin và quyền hạn người dùng.
   * @param userId - ID của người dùng mục tiêu.
   * @param dto - Dữ liệu cập nhật từ Admin.
   * @throws {AppError} USER.NOT_FOUND - Nếu người dùng không tồn tại hoặc đã bị xóa/khóa.
   */
  public async updateUserByAdmin(
    userId: string,
    dto: UpdateAdminRequestDTO,
  ): Promise<void> {
    // 1. Kiểm tra nghiệp vụ (Dùng Entity Rich Logic)
    const user = await this._userRepo.findActiveById(userId);
    if (!user) throw new AppError(ErrorCode.USER.NOT_FOUND);

    // 3. Kiểm tra tính hợp lệ sơ bộ của DTO trước khi xuống Service

    // Cập nhật thông tin vào Entity (Validation thực hiện bên trong Entity)
    if (dto.fullName) user.updateFullName(dto.fullName);

    // 2. Chạy Transaction
    await this._prisma.$transaction(async (tx) => {
      // Lưu thông tin cơ bản (Cần ép kiểu tx về Prisma.TransactionClient trong Repo update)
      await this._userRepo.updateUser(user, tx);

      // Đồng bộ hóa Role nếu Admin có gửi danh sách mới
      if (dto.roles) {
        await this._userRoleRepo.syncUserRoles(userId, dto.roles, tx);
      }
    });
  }

  /**
   * @description  Tác dụng: Cập nhật thông tin người dùng vào cơ sở dữ liệu.
   * @param {User} user - Đối tượng Entity User đã được thay đổi dữ liệu.
   * @returns {Promise<User>} - Trả về Entity sau khi lưu thành công.
   */
  public update = async (user: User): Promise<User> => {
    const updatedUser = await this._userRepo.updateUser(user);
    return updatedUser;
  };

  /**
   * @description Thực hiện nghiệp vụ đổi mật khẩu và thu hồi toàn bộ phiên đăng nhập cũ.
   * @param {string} userId - ID người dùng lấy từ Token xác thực. (User ID from Auth Token).
   * @param {ChangePasswordRequestDTO} dto - Dữ liệu mật khẩu cũ và mới. (Old and new password data).
   * @returns {Promise<IUserResponseDTO>} Thông tin người dùng sau khi cập nhật thành công.
   * @throws {AppError} USER.NOT_FOUND - Nếu người dùng không tồn tại hoặc đã bị xóa/khóa.
   */
  public async changePassword(
    userId: string,
    dto: ChangePasswordRequestDTO,
  ): Promise<IUserResponseDTO> {
    // 1. Kiểm tra sự tồn tại của người dùng (Check user existence)
    // Chỉ cho phép người dùng đang hoạt động thực hiện đổi mật khẩu
    const user = await this._userRepo.findActiveById(userId);
    if (!user) {
      throw new AppError(ErrorCode.USER.NOT_FOUND);
    }

    // 2. Rule 6: Rich Domain Model - Logic nghiệp vụ nằm trong Entity
    // (Business logic resides in the Entity - Heavy Check)
    // Bao gồm so sánh mật khẩu cũ (bcrypt) và kiểm tra tính hợp lệ của mật khẩu mới
    await user.updatePassword(dto.oldPassword, dto.newPassword, bcrypt.compare);

    // 3. Lưu thay đổi vào cơ sở dữ liệu (Persist changes to Database)
    const updatedUser = await this._userRepo.updateUser(user);
    if (!updatedUser) {
      throw new AppError(ErrorCode.SYSTEM.DATABASE_ERROR);
    }

    // 4. Bảo mật: Thu hồi toàn bộ Token cũ (Security: Revoke all old tokens)
    // Đảm bảo sau khi đổi mật khẩu, các thiết bị khác phải đăng nhập lại
    await this._tokenManager.revokeTokenByPattern(userId);

    // 5. Trả về DTO thông qua Mapper để đảm bảo tính đóng gói
    // (Return DTO via Mapper to ensure encapsulation)
    return UserMapper.toResponse(updatedUser);
  }

  /**
   * @description Cập nhật trạng thái hoạt động của tài khoản (Dành cho quản trị viên).
   * @param {string} userId - ID của người dùng cần cập nhật. (User ID to update).
   * @param {ChangeStatusRequestDTO} dto - Dữ liệu trạng thái mới. (New status data).
   * @returns {Promise<IUserResponseDTO>} Thông tin người dùng sau khi cập nhật.
   */
  public async updateStatus(
    userId: string,
    dto: ChangeStatusRequestDTO,
  ): Promise<IUserResponseDTO> {
    // 1. Lấy thực thể người dùng hoặc ném lỗi nếu không tìm thấy
    const user = await this.getActiveUserOrThrow(userId);

    // 2. Cập nhật trạng thái ngay trong Domain Entity
    user.updateStatus(dto.status as UserStatus);

    // 3. Persist thay đổi vào Database
    const updatedUser = await this._userRepo.updateUser(user);

    // 4. Trả về DTO thông qua Mapper
    return UserMapper.toResponse(updatedUser);
  }

  /**
   * @description Thực hiện chiến lược "Xóa thông minh" (Smart Delete) cho tài khoản người dùng.
   * @param {string} userId - ID của người dùng cần xóa. (User ID to delete).
   * @returns {Promise<IDeleteResponseDTO>} Kết quả thao tác xóa kèm thông báo chuẩn hóa.
   */
  public async deleteUser(userId: string): Promise<IDeleteResponseDTO> {
    const user = await this.getActiveUserOrThrow(userId);

    // Kiểm tra các ràng buộc dữ liệu (Kết quả thi, lượt làm bài)
    const related = await this._userRepo.countRelatedData(userId);
    const totalRelated = related.userRoles;

    let type: DeleteType;

    if (totalRelated > 0) {
      // Có dữ liệu liên quan -> Xóa mềm (Soft Delete)
      user.softDelete();
      await this._userRepo.updateUser(user);
      type = DeleteType.SOFT;
    } else {
      // Dữ liệu sạch -> Xóa vĩnh viễn (Hard Delete)
      await this._userRepo.hardDelete(userId);
      type = DeleteType.HARD;
    }

    // Trả về DTO - Message sẽ được tự động tạo dựa trên 'type' và 'count'
    return new DeleteResponseDTO({
      id: userId,
      type,
      count: totalRelated,
    });
  }

  /**
   * @description Khôi phục tài khoản người dùng đã bị xóa mềm về trạng thái hoạt động.
   * @param {string} userId - ID của người dùng cần khôi phục. (User ID to restore).
   * @returns {Promise<IUserResponseDTO>} Thông tin người dùng sau khi khôi phục thành công.
   * @throws {AppError} USER.NOT_FOUND - Nếu người dùng không tồn tại hoặc đã bị xóa/khóa.
   */
  public async restoreUser(userId: string): Promise<IUserResponseDTO> {
    // 1. Tìm kiếm cả những người dùng đã bị xóa trong hệ thống
    const user = await this._userRepo.findByIdInSystem(userId);

    if (!user) {
      throw new AppError(ErrorCode.USER.NOT_FOUND);
    }

    // 2. Logic khôi phục nằm trong Domain Entity
    user.restore();

    // 3. Cập nhật lại Database
    const restoredUser = await this._userRepo.updateUser(user);

    // 4. Trả về DTO sạch sẽ thông qua Mapper
    return UserMapper.toResponse(restoredUser);
  }

  /**
   * @description Kiểm tra tính duy nhất của Username và Email trong hệ thống.
   * Thực hiện chuẩn hóa dữ liệu trước khi truy vấn và ném lỗi cụ thể theo thứ tự ưu tiên.
   * @param {string} username - Tên đăng nhập cần kiểm tra.
   * @param {string} email - Địa chỉ email cần kiểm tra.
   * @returns {Promise<false>} Trả về false nếu thông tin hợp lệ (không trùng lặp).
   * @throws {AppError} USER.USERNAME_EXISTS - Nếu tên đăng nhập đã tồn tại trong hệ thống.
   * @throws {AppError} USER.EMAIL_EXISTS - Nếu địa chỉ email đã tồn tại trong hệ thống.
   */
  public async checkExisting(
    username: string,
    email: string,
  ): Promise<boolean> {
    const normalizedEmail = email.trim().toLowerCase();
    const normalizedUsername = username.trim().toLowerCase();

    // 1. Lấy danh sách trùng từ Repo (findMany)
    const existingUsers = await this._userRepo.findExistingInSystem(
      normalizedEmail,
      normalizedUsername,
    );

    // 2. Nếu có bản ghi trùng khớp
    if (existingUsers.length > 0) {
      const isUsernameTaken = existingUsers.some(
        (u) => u.username === normalizedUsername,
      );
      const isEmailTaken = existingUsers.some(
        (u) => u.email === normalizedEmail,
      );

      // Ném lỗi ưu tiên để UI hiển thị chính xác
      if (isUsernameTaken) {
        throw new AppError(ErrorCode.USER.USERNAME_EXISTS);
      }

      if (isEmailTaken) {
        throw new AppError(ErrorCode.USER.EMAIL_EXISTS);
      }
    }

    // 3. Nếu chạy đến đây, nghĩa là không có ai trùng
    return false;
  }

  /**
   * @description Đăng ký người dùng mới, tự động gán vai trò STUDENT từ cache và lưu trữ.
   * @param {User} user - Thực thể người dùng đã qua bước khởi tạo cơ bản.
   * @returns {Promise<User>} Thực thể người dùng đã có đầy đủ thông tin vai trò và ID lưu trữ.
   * @throws {AppError} AUTH.ROLES_NOT_INITIALIZED - Nếu dữ liệu vai trò STUDENT không tồn tại trong cache hệ thống.
   */
  public async createUser(user: User): Promise<User> {
    const roleData = this._cacheService.getRoleByName(UserRole.STUDENT);

    if (!roleData) {
      throw new AppError(ErrorCode.AUTH.ROLES_NOT_INITIALIZED);
    }

    const defaultRole = Role.reconstitute({
      id: roleData.id,
      name: roleData.name,
      description: roleData.description,
      permissions: [],
    });

    user.assignRole(defaultRole);

    const newUser = await this._userRepo.createUser(user);

    return newUser;
  }

  /**
   * @description Tìm kiếm người dùng đang hoạt động theo ID.
   * Đảm bảo trả về một thực thể hợp lệ, nếu không sẽ ngắt tiến trình bằng ngoại lệ.
   * @param {string} userId - ID định danh của người dùng cần truy vấn.
   * @returns {Promise<User>} Thực thể người dùng (User Entity) nếu tìm thấy.
   * @throws {AppError} USER.NOT_FOUND - Nếu người dùng không tồn tại hoặc đã bị xóa/khóa.
   */
  private async getActiveUserOrThrow(userId: string): Promise<User> {
    const user = await this._userRepo.findActiveById(userId);
    if (!user) {
      throw new AppError(ErrorCode.USER.NOT_FOUND);
    }
    return user;
  }
}
