import { LicenseCategory } from "@/domain/entities/license-category/license-category.entity";
import { ILicenseCategoryRepository } from "@/domain/interfaces/repositories/exam-mgmt/i-license-category-repository";
import { AppError, ErrorCode } from "@/shared/errors";
import { LicenseCategoryMapper } from "@/infrastructure/database/mappers/exam-mgmt/license-category.mapper";
import { ILicenseCategoryService } from "@/domain/interfaces/services/exam-mgmt/commands/i-license-category.service";
import { IMasterDataCacheService } from "@/domain/interfaces/services/exam-mgmt/commands/i-master-data-cache.service";
import { CreateLicenseCategoryRequestDTO } from "@/application/dtos/request/license-category/create-license-category.request.dto";
import { UpdateLicenseCategoryRequestDTO } from "@/application/dtos/request/license-category/update-license-category.request.dto";
import { ILicenseCategoryResponseDTO } from "@/application/dtos/response/license-category/license-category.respone.dto";
import {
  IDeleteResponseDTO,
  DeleteResponseDTO,
} from "@/application/dtos/response/shared/delete.response.dto";
import { DeleteType } from "@/domain/constants/delete.constant";

/**
 * @interface ILicenseCategoryServiceCradle
 * @description Tập hợp các phụ thuộc (Dependencies) phục vụ việc quản lý nghiệp vụ Hạng bằng lái.
 * @principle Interface Segregation (ISP) - Chỉ bao gồm các service cần thiết để thực hiện ghi và đồng bộ dữ liệu.
 */
export interface ILicenseCategoryServiceCradle {
  /** @description Repository thực hiện các thao tác thêm, sửa, xóa hạng bằng lái trong Database. */
  licenseCategoryRepository: ILicenseCategoryRepository;

  /** @description Dịch vụ quản lý bộ nhớ đệm (Dùng để dọn dẹp hoặc cập nhật cache Master Data). */
  masterDataCacheService: IMasterDataCacheService;
}

/**
 * @class LicenseCategoryService
 * @description Dịch vụ điều phối các logic nghiệp vụ (Write-side) liên quan đến phân loại hạng giấy phép lái xe.
 * @principle Cache Consistency - Đảm bảo dọn dẹp Cache Master Data ngay sau khi dữ liệu hạng bằng lái thay đổi.
 */
export class LicenseCategoryService implements ILicenseCategoryService {
  /** @private @readonly @description Instance thực hiện các thao tác ghi dữ liệu Hạng bằng lái. */
  private readonly _repo: ILicenseCategoryRepository;

  /** @private @readonly @description Dịch vụ xử lý làm mới bộ nhớ đệm hệ thống. */
  private readonly _cacheService: IMasterDataCacheService;

  /**
   * @constructor
   * @description Khởi tạo LicenseCategoryService thông qua cơ chế Dependency Injection (Cradle).
   * @param {ILicenseCategoryServiceCradle} cradle - Chứa các phụ thuộc cần thiết cho việc quản lý trạng thái dữ liệu.
   */
  constructor({
    licenseCategoryRepository,
    masterDataCacheService,
  }: ILicenseCategoryServiceCradle) {
    this._repo = licenseCategoryRepository;
    this._cacheService = masterDataCacheService;
  }

  /**
   * @description Tạo mới một hạng bằng lái vào hệ thống.
   * @param {CreateLicenseCategoryRequestDTO} dto - Dữ liệu cấu hình hạng bằng mới.
   * @returns {Promise<ILicenseCategoryResponseDTO>} Thông tin hạng bằng vừa được tạo.
   */
  public async createCategory(
    dto: CreateLicenseCategoryRequestDTO,
  ): Promise<ILicenseCategoryResponseDTO> {
    const existing = await this._repo.findByName(dto.name);
    if (existing) {
      throw new AppError(ErrorCode.LICENSE.NAME_ALREADY_EXISTS);
    }

    const category = LicenseCategory.create({
      name: dto.name,
      description: dto.description,
      minAge: dto.minAge,
      orderIndex: dto.orderIndex,
    });

    await this._repo.createLicenseCategory(category);
    this._cacheService.refresh();
    return LicenseCategoryMapper.toResponse(category);
  }

  /**
   * @description Cập nhật thông tin hạng bằng lái.
   * @param {UpdateLicenseCategoryRequestDTO} dto - Dữ liệu cập nhật từ Client.
   * @returns {Promise<void>}
   */
  public async updateCategory(
    id: string,
    dto: UpdateLicenseCategoryRequestDTO,
  ): Promise<ILicenseCategoryResponseDTO> {
    // 1. Kiểm tra sự tồn tại của hạng bằng lái
    const category = await this._repo.findById(id);
    if (!category) {
      throw new AppError(ErrorCode.LICENSE.NOT_FOUND);
    }

    // 2. Nếu tên thay đổi, kiểm tra xem tên mới đã tồn tại chưa (Unique Check)
    if (category.name !== dto.name) {
      const existingName = await this._repo.findByName(dto.name);
      if (existingName) {
        throw new AppError(ErrorCode.LICENSE.NAME_ALREADY_EXISTS);
      }
    }

    // 3. Sử dụng Rich Domain Model để cập nhật logic bên trong Entity
    category.updateDetails(
      dto.name,
      dto.description,
      dto.minAge,
      dto.orderIndex,
    );

    // 4. Lưu lại thay đổi thông qua Repository
    await this._repo.updateLicenseCategory(category);
    this._cacheService.refresh();
    return LicenseCategoryMapper.toResponse(category);
  }

  /**
   * @description Thực thi chiến lược "Xóa thông minh" cho Hạng bằng lái.
   * @param {string} id - ID của hạng bằng cần xóa. (The ID of the category to be deleted.)
   * @returns {Promise<IDeleteResponseDTO>} Kết quả thao tác xóa kèm thông báo chuẩn hóa.
   */
  public async deleteCategory(id: string): Promise<IDeleteResponseDTO> {
    // 1. Kiểm tra tồn tại (Ném lỗi 404 nếu không tìm thấy)
    // (Check existence - Throws 404 if not found)
    const category = await this._repo.findById(id);
    if (!category) {
      throw new AppError(ErrorCode.LICENSE.NOT_FOUND);
    }

    // 2. Lấy chi tiết các ràng buộc từ Repository
    // (Retrieve constraint details from Repository)
    const related = await this._repo.countRelatedData(id);

    // Tính tổng số lượng liên kết từ tất cả các phân hệ liên quan
    const totalRelated = related.questions + related.matrices + related.exams;

    let type: DeleteType;

    // 3. Quyết định phương thức xóa dựa trên trạng thái dữ liệu (Decision logic)
    if (totalRelated > 0) {
      // TRƯỜNG HỢP 1: CÓ RÀNG BUỘC -> XÓA MỀM (Case 1: Has constraints -> Soft Delete)
      category.softDelete(); // Cập nhật trạng thái trong Entity memory
      await this._repo.softDelete(id); // Đồng bộ vào Database
      type = DeleteType.SOFT;
    } else {
      // TRƯỜNG HỢP 2: DỮ LIỆU SẠCH -> XÓA VĨNH VIỄN (Case 2: Clean data -> Hard Delete)
      await this._repo.hardDelete(id);
      type = DeleteType.HARD;
    }

    // 4. Làm mới bộ nhớ đệm (Refresh cache service)
    await this._cacheService.refresh();

    // 5. Trả về DTO - Logic tạo message đã được đóng gói bên trong Class
    // (Return DTO - Message logic is encapsulated within the Class)
    return new DeleteResponseDTO({
      id,
      type,
      count: totalRelated,
    });
  }

  /**
   * @description Khôi phục hạng bằng lái đã bị xóa mềm (Soft Delete) trở lại trạng thái hoạt động.
   * @param {string} id - Mã định danh của hạng bằng cần khôi phục.
   * @returns {Promise<ILicenseCategoryResponseDTO>} Thông tin hạng bằng sau khi phục hồi.
   */
  public async restoreCategory(
    id: string,
  ): Promise<ILicenseCategoryResponseDTO> {
    // 1. Tìm bản ghi (bao gồm cả đã xóa)
    const category = await this._repo.findByIdIncludingDeleted(id);
    if (!category) {
      throw new AppError(ErrorCode.LICENSE.NOT_FOUND);
    }

    // 2. Kiểm tra xem có đang thực sự bị xóa không
    // Nếu bản ghi chưa xóa thì không cần restore
    if (!category.isDeleted()) {
      throw new AppError(ErrorCode.LICENSE.ALREADY_EXISTS);
    }

    category.restore();
    // 3. Thực hiện khôi phục
    const restored = await this._repo.restore(id);
    this._cacheService.refresh();
    return LicenseCategoryMapper.toResponse(restored);
  }

  /**
   * @description Kiểm tra sự tồn tại của hạng bằng lái trong Database.
   * @param {string} id - ID hạng bằng cần kiểm tra.
   * @returns {Promise<boolean>} True nếu tồn tại, ngược lại là false.
   */
  public async exists(id: string): Promise<boolean> {
    return await this._repo.exists(id);
  }
}
