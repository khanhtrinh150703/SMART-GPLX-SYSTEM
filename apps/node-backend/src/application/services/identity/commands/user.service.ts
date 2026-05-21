import { AppError, ErrorCode } from "@/shared/errors";
import { User } from "@/domain/entities/user/user.entity";
import { IUserRepository } from "@/domain/interfaces/repositories/identity/i-user.repository";
import { ITokenManager } from "@/domain/interfaces/services/external/commands/i-token-manager.service";
import { UserRole } from "@/domain/constants/roles.constant";
import { IUserService } from "@/domain/interfaces/services/identity/commands/i-user.service";
import { UserMapper } from "@/infrastructure/database/mappers/identity/user.mapper";
import { STORAGE_FOLDERS } from "@/domain/constants/storage.constant";
import { IUserRoleRepository } from "@/domain/interfaces/repositories/identity/i-user-role.repository";
import { IMediaService } from "@/domain/interfaces/services/integration/commands/i-media.service";
import { IMasterDataCacheService } from "@/domain/interfaces/services/exam-mgmt/commands/i-master-data-cache.service";
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
import { ILogger } from "@/domain/interfaces/monitoring/i-logger";
import { AdminCreateUserRequestDTO } from "@/application/dtos/request/auth/admin-create-user.request.dto";
import { ICreateUserInput } from "@/application/dtos/request/auth/create-user-request.dto";
import { IUnitOfWork } from "@/domain/interfaces/seedwork";

/**
 * @interface IUserServiceCradle
 * @description Định nghĩa các phụ thuộc (dependencies) sạch được tiêm từ DI Container (Awilix Proxy).
 * Tuyệt đối không chứa trực tiếp PrismaClient nhằm bảo vệ tính cô lập của tầng nghiệp vụ.
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

  /** @description Đơn vị điều phối transaction trừu tượng (Unit of Work). */
  unitOfWork: IUnitOfWork;

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

  /** @private @readonly @description Bộ điều phối giao dịch an toàn (Unit of Work). */
  private readonly _uow: IUnitOfWork;

  /** @private @readonly @description Dịch vụ ghi log hệ thống. */
  private readonly _logger: ILogger;

  /**
   * @constructor
   * @description Khởi tạo Service với các phụ thuộc sạch hoàn toàn từ cấu trúc Cradle của Awilix.
   * @param {IUserServiceCradle} cradle - Thùng chứa các phụ thuộc hạ tầng đã được trừu tượng hóa qua Interface.
   */
  constructor({
    userRepository,
    userRoleRepository,
    tokenManager,
    mediaService,
    masterDataCacheService,
    unitOfWork,
    logger,
  }: IUserServiceCradle) {
    this._userRepo = userRepository;
    this._userRoleRepo = userRoleRepository;
    this._tokenManager = tokenManager;
    this._mediaService = mediaService;
    this._cacheService = masterDataCacheService;
    this._uow = unitOfWork;
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
   * @description Dịch vụ dành cho Quản trị viên cập nhật thông tin họ tên và đồng bộ hóa quyền hạn (vai trò) của người dùng.
   * @param {string} userId - Định danh duy nhất (UUID) của người dùng cần được cập nhật.
   * @param {UpdateAdminRequestDTO} dto - Dữ liệu chuyển giao chứa các thông tin thay đổi được gửi từ phía Admin.
   * @returns {Promise<void>} Trả về một Promise rỗng khi toàn bộ tiến trình cập nhật và đồng bộ hoàn tất thành công.
   * @throws {AppError} USER.NOT_FOUND - Phát ra lỗi nghiệp vụ nếu tài khoản không tồn tại hoặc đã bị xóa mềm trên hệ thống.
   */
  public async updateUserByAdmin(
    userId: string,
    dto: UpdateAdminRequestDTO,
  ): Promise<void> {
    // 1. Kiểm tra sự tồn tại của người dùng mục tiêu (Sử dụng Active Domain Entity)
    const user = await this._userRepo.findActiveById(userId);
    if (!user) {
      throw new AppError(ErrorCode.USER.NOT_FOUND);
    }

    // 2. Thực thi kiểm tra nghiệp vụ và đột biến trạng thái thông qua Entity Rich Logic
    if (dto.fullName) {
      user.updateFullName(dto.fullName);
    }

    // 3. Khởi chạy Giao dịch an toàn (Transaction) được bao bọc cô lập bởi Unit of Work
    await this._uow.runInTransaction(async () => {
      // Khởi tạo mảng lưu trữ các tiến trình I/O nhằm kích hoạt tối ưu hóa chạy song song
      const databaseOperations: Promise<unknown>[] = [
        this._userRepo.updateUser(user), 
      ];

      // 4. Kiểm tra điều kiện đồng bộ hóa danh sách vai trò nếu Quản trị viên có cung cấp dữ liệu mới
      if (dto.roles) {
        databaseOperations.push(
          this._userRoleRepo.syncUserRoles(userId, dto.roles),
        );
      }

      // 5. Tối ưu hóa song song (Parallelism) - Kích hoạt thực thi đồng thời các câu lệnh ghi cơ sở dữ liệu
      await Promise.all(databaseOperations);
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
    // 1. Kiểm tra sự tồn tại của người dùng
    // Chỉ cho phép người dùng đang hoạt động thực hiện đổi mật khẩu
    const user = await this._userRepo.findActiveById(userId);
    if (!user) {
      throw new AppError(ErrorCode.USER.NOT_FOUND);
    }

    // 2. Rule 6: Rich Domain Model - Logic nghiệp vụ nằm trong Entity
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
    user.updateStatus(dto.status);

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
    const totalRelated =
      related.userRoles +
      related.userExam +
      related.userExamRank +
      related.userQuestionProgress +
      related.userTopicStats;
    let type: DeleteType;

    if (totalRelated > 0) {
      // Có dữ liệu liên quan -> Xóa mềm (Soft Delete)
      user.softDelete();
      await this._userRepo.softDelete(userId);
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
    await this._userRepo.restore(userId);

    // 4. Trả về DTO sạch sẽ thông qua Mapper
    return UserMapper.toResponse(user);
  }

  /**
   * @description Kiểm tra tính duy nhất của Username và Email trong hệ thống.
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
   * @description Tiếp nhận dữ liệu thô từ luồng đăng ký hợp lệ, phối hợp kiểm tra trùng lặp.
   * @param {ICreateUserInput} input - Giao diện chứa thông tin cơ bản của người dùng đăng ký.
   * @returns {Promise<User>} Thực thể người dùng hoàn chỉnh sau khi lưu trữ thành công vào MySQL.
   */
  public async createUser(input: ICreateUserInput): Promise<User> {
    // 1. Kiểm tra tính duy nhất của tài khoản bằng hàm nội bộ song song (Tối ưu I/O)
    await this.validateUserUniqueness(input.username, input.email);

    // 2. Lấy dữ liệu cấu hình vai trò STUDENT từ cache hệ thống
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

    // 3. Khởi tạo Rich Domain Entity - Để Entity tự hash mật khẩu nội bộ theo đúng flow của dự án
    const userEntity = await User.create({
      username: input.username,
      email: input.email,
      fullName: input.fullName,
      passwordPlain: input.passwordPlain,
    });

    // 4. Gán vai trò mặc định thông qua phương thức nghiệp vụ của Entity
    userEntity.assignRole(defaultRole);

    // 5. Hạ lệnh xuống Repository để lưu cấu trúc dữ liệu hoàn chỉnh xuống MySQL
    const newUser = await this._userRepo.createUser(userEntity);

    return newUser;
  }

  /**
   * @description Nghiệp vụ dành cho Admin khởi tạo một người dùng mới với danh sách quyền hạn tùy chọn, giao quyền mã hóa cho Entity.
   * @param {AdminCreateUserRequestDTO} dto - Đối tượng DTO đầu vào đã qua bộ lọc tự kiểm tra dữ liệu sạch.
   * @returns {Promise<IUserResponseDTO>} Đối tượng dữ liệu phản hồi sau khi qua lớp Mapper bảo mật.
   * @throws {AppError} AUTH.USERNAME_ALREADY_EXISTS - Nếu tài khoản bị trùng.
   * @throws {AppError} AUTH.EMAIL_ALREADY_EXISTS - Nếu email bị trùng.
   * @throws {AppError} AUTH.ROLES_NOT_INITIALIZED - Nếu có vai trò truyền vào không tồn tại trong cache hệ thống.
   */
  public async adminCreateUser(
    dto: AdminCreateUserRequestDTO,
  ): Promise<IUserResponseDTO> {
    // 1. Kiểm tra tính duy nhất của Username và Email thông qua hàm private song song (Tối ưu I/O)
    await this.validateUserUniqueness(dto.username, dto.email);

    // 2. Khởi tạo Rich Domain Entity - Truyền trực tiếp dữ liệu từ dto và để Entity tự thực hiện hash mật khẩu nội bộ
    const userEntity = await User.create({
      username: dto.username,
      email: dto.email,
      fullName: dto.fullName,
      passwordPlain: dto.password,
    });

    // 3. Xử lý logic duyệt mảng và gán quyền hạn (Roles) do Admin chỉ định
    dto.roles.forEach((roleId) => {
      const roleData = this._cacheService.getRoleById(roleId);

      if (!roleData) {
        throw new AppError(ErrorCode.AUTH.ROLES_NOT_INITIALIZED);
      }

      const assignedRole = Role.reconstitute({
        id: roleData.id,
        name: roleData.name,
        description: roleData.description,
        permissions: [],
      });

      // Thực thi hành vi nghiệp vụ gán vai trò an toàn của Entity
      userEntity.assignRole(assignedRole);
    });

    // 4. Hạ lệnh xuống Repository để thực hiện lưu trữ bản ghi mới kèm theo các bảng quan hệ vào MySQL
    const newUser = await this._userRepo.createUser(userEntity);

    // 5. Trả về Response DTO qua Mapper để lọc bỏ toàn bộ các trường nhạy cảm dữ liệu đầu ra
    return UserMapper.toResponse(newUser);
  }

  /**
   * @private
   * @description Hàm bổ trợ nội bộ thực hiện kiểm tra song song tính duy nhất của Username và Email trong cơ sở dữ liệu.
   * @param {string} username - Tên tài khoản người dùng cần kiểm tra.
   * @param {string} email - Địa chỉ email cần kiểm tra.
   * @returns {Promise<void>} Hoàn thành xử lý nếu dữ liệu là duy nhất và hợp lệ.
   * @throws {AppError} AUTH.USERNAME_ALREADY_EXISTS - Nếu tên tài khoản đã tồn tại trên hệ thống.
   * @throws {AppError} AUTH.EMAIL_ALREADY_EXISTS - Nếu địa chỉ email đã tồn tại trên hệ thống.
   */
  private async validateUserUniqueness(
    username: string,
    email: string,
  ): Promise<void> {
    // Tối ưu hóa song song (Parallelism) cho các tác vụ I/O truy vấn database để đạt hiệu năng tối đa
    const [existingUsername, existingEmail] = await Promise.all([
      this._userRepo.findByUsernameInSystem(username),
      this._userRepo.findByEmailInSystem(email),
    ]);

    if (existingUsername) {
      throw new AppError(ErrorCode.AUTH.USERNAME_ALREADY_EXISTS);
    }

    if (existingEmail) {
      throw new AppError(ErrorCode.AUTH.EMAIL_ALREADY_EXISTS);
    }
  }

  /**
   * @description Tìm kiếm người dùng đang hoạt động theo ID.
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
