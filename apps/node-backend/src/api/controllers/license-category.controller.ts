import { Request, Response } from 'express';
import { catchAsync } from '@/shared/utils/catch-async';
import { CreateLicenseCategoryDTO } from '@/application/dtos/request/license-category/create-license-category.dto';
import { Message } from '@/shared/errors/messages/success-messages-vn';
import { Result } from '@/shared/responses/api-response';
import { UpdateLicenseCategoryDTO } from '@/application/dtos/request/license-category/update-license-category.dto';
import { ICradle } from '@/shared/types/container.types';
import { ILicenseCategoryService } from '@/domain/interfaces/services/i-license-category.service';


/**
 * Controller điều phối các yêu cầu HTTP liên quan đến Danh mục hạng bằng lái.
 * Tuân thủ Clean Architecture: Chỉ nhận Request, gọi Service và trả về Response chuẩn qua Result class.
 */
export class LicenseCategoryController {
  private readonly _licenseService: ILicenseCategoryService;

  /**
   * Khởi tạo Controller với Dependency Injection.
   * @param {ICradle} dependencies - Các service cần thiết được inject từ container.
   */
  constructor({ licenseCategoryService }: ICradle) {
    this._licenseService = licenseCategoryService;
  }

  /**
   * API Lấy danh sách toàn bộ hạng bằng lái hiện có.
   * @route GET /api/v1/license-categories
   * @param {Request} _req - Đối tượng Request của Express.
   * @param {Response} res - Đối tượng Response của Express.
   * @returns {Promise<void>}
   */
  public list = catchAsync(async (_req: Request, res: Response): Promise<void> => {
    const categories = await this._licenseService.getAll();

    Result.ok(
      res,
      categories,
      Message.LICENSE.FETCH_SUCCESS,
      'LICENSE_FETCH_SUCCESS'
    );
  });

  /**
   * API Tạo mới một hạng bằng lái.
   * @route POST /api/v1/license-categories
   * @param {Request} req - Chứa body (name, description).
   * @param {Response} res - Đối tượng Response của Express.
   * @returns {Promise<void>}
   */
  public store = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const { name, description } = req.body;

    // Khởi tạo và thực thi tự kiểm tra dữ liệu (Self-Validating DTO)
    const dto = new CreateLicenseCategoryDTO({ name, description });
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
   * API Cập nhật thông tin hạng bằng lái.
   * @route PUT /api/v1/license-categories/:id
   * @param {Request} req - Chứa params.id và body mới.
   * @param {Response} res - Đối tượng Response của Express.
   * @returns {Promise<void>}
   */
  public update = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const id = req.params.id as string;
    const { name, description } = req.body;

    // Sử dụng DTO để validate dữ liệu cập nhật
    const dto = new UpdateLicenseCategoryDTO({ id, name, description });
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
   * API Xóa (xóa mềm) một hạng bằng lái.
   * @route DELETE /api/v1/license-categories/:id
   * @param {Request} req - Chứa params.id.
   * @param {Response} res - Đối tượng Response của Express.
   * @returns {Promise<void>}
   */
  public destroy = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const id = req.params.id as string;

    await this._licenseService.deleteCategory(id);

    Result.ok(
      res,
      undefined,
      Message.LICENSE.DELETE_SUCCESS,
      'LICENSE_DELETE_SUCCESS'
    );
  });


  /**
   * API Khôi phục hạng bằng lái đã bị xóa mềm.
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
}