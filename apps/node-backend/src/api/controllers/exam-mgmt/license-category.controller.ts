import { Request, Response } from 'express';
import { catchAsync } from '@/shared/utils/catch-async.utils';
import { Message } from '@/shared/errors/messages/success-messages-vn';
import { Result } from '@/application/dtos/response/shared/api.response.dto';
import { CreateLicenseCategoryRequestDTO } from '@/application/dtos/request/license-category/create-license-category.request.dto';
import { UpdateLicenseCategoryRequestDTO } from '@/application/dtos/request/license-category/update-license-category.request.dto';
import { LicenseCategoryQueryDTO } from '@/application/dtos/request/license-category/license-category-query.request.dto';
import { ILicenseCategoryService } from '@/domain/interfaces/services/exam-mgmt';
import { ILicenseCategoryQueryService } from '@/domain/interfaces/services/exam-mgmt/queries';

/**
 * @interface ILicenseCategoryControllerCradle
 * @description "Túi đồ nghề" (Dependencies Container) chuyên biệt cho LicenseCategoryController.
 * Đảm bảo tính đóng gói (Encapsulation) khi chỉ cho phép Controller tiếp cận các dịch vụ quản lý hạng bằng lái tương ứng.
 */
export interface ILicenseCategoryControllerCradle {
  /** @description Dịch vụ thực hiện các thay đổi về danh mục hạng bằng (Thêm/Sửa/Xóa). */
  licenseCategoryService: ILicenseCategoryService;

  /** @description Dịch vụ xử lý các yêu cầu truy vấn thông tin hạng bằng lái. */
  licenseCategoryQueryService: ILicenseCategoryQueryService;
}

/**
 * @class LicenseCategoryController
 * @description Lớp điều phối (Orchestrator) các yêu cầu HTTP liên quan đến Danh mục hạng bằng lái.
 * @principle Domain Specificity - Tập trung hoàn toàn vào việc quản lý vòng đời và cấu trúc của các loại giấy phép lái xe. 
 */
export class LicenseCategoryController {
  /** @private @readonly @description Instance xử lý các logic nghiệp vụ thay đổi trạng thái hạng bằng. */
  private readonly _licenseService: ILicenseCategoryService;

  /** @private @readonly @description Instance xử lý các yêu cầu đọc và tra cứu danh mục hạng bằng. */
  private readonly _licenseQueryService: ILicenseCategoryQueryService;

  /**
   * @constructor
   * @description Khởi tạo LicenseCategoryController thông qua cơ chế tiêm phụ thuộc (DI).
   * @param {ILicenseCategoryControllerCradle} cradle - Chứa các dịch vụ chuyên biệt được giải nén để sử dụng nội bộ.
   */
  constructor({ licenseCategoryService, licenseCategoryQueryService }: ILicenseCategoryControllerCradle) {
    this._licenseService = licenseCategoryService;
    this._licenseQueryService = licenseCategoryQueryService;
  }

  /**
   * @description API Lấy danh sách toàn bộ hạng bằng lái hiện có.
   * @route GET /api/v1/license-categories
   * @param {Request} req - Đối tượng Request của Express.
   * @param {Response} res - Đối tượng Response của Express.
   * @returns {Promise<void>}
   */
  public list = catchAsync(async (req: Request, res: Response): Promise<void> => {

    console.log(req.query)
    const query = new LicenseCategoryQueryDTO(req.query as Record<string, unknown>);
    console.log(query)
    const categories = await this._licenseQueryService.getPaginatedCategories(query);
    Result.ok(
      res,
      categories,
      Message.LICENSE.FETCH_SUCCESS,
      'LICENSE_FETCH_SUCCESS'
    );
  });

  /**
   * @description API Tạo mới một hạng bằng lái.
   * @route POST /api/v1/license-categories
   * @param {Request} req - Chứa body (name, description).
   * @param {Response} res - Đối tượng Response của Express.
   * @returns {Promise<void>}
   */
  public store = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const { name, description, minAge, orderIndex } = req.body;

    // Khởi tạo và thực thi tự kiểm tra dữ liệu (Self-Validating DTO)
    const dto = new CreateLicenseCategoryRequestDTO({ name, description, minAge, orderIndex });

    const result = await this._licenseService.createCategory(dto);

    Result.ok(
      res,
      result,
      Message.LICENSE.CREATE_SUCCESS,
      'LICENSE_CREATE_SUCCESS'
    );
  });

  /**
   * @description API Cập nhật thông tin hạng bằng lái.
   * @route PUT /api/v1/license-categories/:id
   * @param {Request} req - Chứa params.id và body mới.
   * @param {Response} res - Đối tượng Response của Express.
   * @returns {Promise<void>}
   */
  public update = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const id = req.params.id as string;
    const { name, description, minAge, orderIndex } = req.body;

    // Sử dụng DTO để validate dữ liệu cập nhật
    const dto = new UpdateLicenseCategoryRequestDTO({ id, name, description, minAge, orderIndex });
    const result = await this._licenseService.updateCategory(id, dto);
    Result.ok(
      res,
      result,
      Message.LICENSE.UPDATE_SUCCESS,
      'LICENSE_UPDATE_SUCCESS'
    );
  });

  /**
   * @description API Xóa một hạng bằng lái.
   * @route DELETE /api/v1/license-categories/:id
   * @param {Request} req - Chứa params.id.
   * @param {Response} res - Đối tượng Response của Express.
   * @returns {Promise<void>}
   */
  public delete = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const id = req.params.id as string;

    const result = await this._licenseService.deleteCategory(id);
    Result.ok(
      res,
      result,
      Message.LICENSE.DELETE_SUCCESS,
      'LICENSE_DELETE_SUCCESS'
    );
  });

  /**
   * @description API Khôi phục hạng bằng lái đã bị xóa mềm.
   * @route PATCH /api/v1/license-categories/:id/restore
   * @param {Request} req - Chứa UUID hạng bằng trong params.id.
   * @param {Response} res - Đối tượng Response của Express.
   * @returns {Promise<void>}
   */
  public restore = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const id = req.params.id as string;

    const result = await this._licenseService.restoreCategory(id);

    Result.ok(
      res,
      result,
      Message.LICENSE.RESTORE_SUCCESS,
      'LICENSE_RESTORE_SUCCESS'
    );
  });

  /**
   * @description Lấy danh sách các hạng bằng lái định dạng selection (value/label) có hỗ trợ tìm kiếm.
   * @route GET /api/v1/master-data/licenses/selection
   * @param {Response} res - Đối tượng Response của Express.
   * @returns {Promise<void>} Phản hồi danh sách hạng bằng dạng { items, meta }.
   */
  public getLicenseSelections = catchAsync(async (_req: Request, res: Response) => {
    const result = await this._licenseQueryService.getLicenseSelections();
    Result.ok(
      res,
      result,
      Message.LICENSE.GET_SELECTION_SUCCESS,
      'LICENSE_SELECTION_SUCCESS'
    );
  });
}