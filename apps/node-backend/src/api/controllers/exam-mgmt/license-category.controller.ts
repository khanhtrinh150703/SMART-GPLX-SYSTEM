import { Request, Response } from 'express';
import { catchAsync } from '@/shared/utils/catch-async.utils';
import { Message } from '@/shared/errors/messages/success-messages-vn';
import { Result } from '@/shared/responses/api-response';
import { CreateLicenseCategoryRequestDTO } from '@/application/dtos/request/license-category/create-license-category.request.dto';
import { UpdateLicenseCategoryRequestDTO } from '@/application/dtos/request/license-category/update-license-category.request.dto';
import { LicenseCategoryQueryDTO } from '@/application/dtos/request/license-category/license-category-query.request.dto';
import { ILicenseCategoryService } from '@/domain/interfaces/services/exam-mgmt';

/**
 * @interface ILicenseCategoryControllerCradle
 * @description "Túi đồ nghề" chuyên biệt cho LicenseCategoryController.
 * Đảm bảo Controller chỉ có quyền tiếp cận đúng Service mà nó cần điều phối.
 */
export interface ILicenseCategoryControllerCradle {
  licenseCategoryService: ILicenseCategoryService;
}

/**
 * @class LicenseCategoryController
 * @description Tiếp nhận các yêu cầu HTTP và điều phối xử lý nghiệp vụ Danh mục hạng bằng lái.
 */
export class LicenseCategoryController {
  private readonly _licenseService: ILicenseCategoryService;

  /**
   * @description Khởi tạo Controller với các phụ thuộc chuyên biệt.
   * @param {ILicenseCategoryControllerCradle} cradle - Dependencies được tiêm tự động từ Awilix.
   */
  constructor({ licenseCategoryService }: ILicenseCategoryControllerCradle) {
    // Gán instance service từ Cradle vào thuộc tính class
    this._licenseService = licenseCategoryService;
  }

  /**
   * @description API Lấy danh sách toàn bộ hạng bằng lái hiện có.
   * @route GET /api/v1/license-categories
   * @param {Request} _req - Đối tượng Request của Express.
   * @param {Response} res - Đối tượng Response của Express.
   * @returns {Promise<void>}
   */
  public list = catchAsync(async (req: Request, res: Response): Promise<void> => {

    const query = new LicenseCategoryQueryDTO(req.query as Record<string, unknown>);
    const categories = await this._licenseService.getPaginatedCategories(query);

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
    const { name, description, minAge } = req.body;

    // Khởi tạo và thực thi tự kiểm tra dữ liệu (Self-Validating DTO)
    const dto = new CreateLicenseCategoryRequestDTO({ name, description, minAge });
    dto.isValid();

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
    const { name, description, minAge } = req.body;

    // Sử dụng DTO để validate dữ liệu cập nhật
    const dto = new UpdateLicenseCategoryRequestDTO({ id, name, description, minAge });
    dto.isValid();

    const result = await this._licenseService.updateCategory(dto);

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
    const result = await this._licenseService.getLicenseSelections();
    Result.ok(
      res,
      result,
      Message.LICENSE.GET_SELECTION_SUCCESS,
      'LICENSE_SELECTION_SUCCESS'
    );
  });
}