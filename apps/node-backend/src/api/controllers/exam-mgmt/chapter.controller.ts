import { Request, Response } from 'express';
import { Message } from '@/shared/errors/messages/success-messages-vn';
import { catchAsync } from '@/shared/utils/catch-async.utils';
import { ChapterQueryDTO } from '@/application/dtos/request/chapter/chapter-query.request.dto';
import { IChapterQueryService, IChapterService } from '@/domain/interfaces/services/exam-mgmt';
import { CreateChapterRequestDTO } from '@/application/dtos/request/chapter/create-chapter.request.dto';
import { UpdateChapterRequestDTO } from '@/application/dtos/request/chapter/update-chapter.request.dto';
import { Result } from '@/application/dtos/response/shared/api.response.dto';

/**
 * @interface IChapterControllerCradle
 * @description Tập hợp các phụ thuộc (Dependencies) được tiêm vào ChapterController thông qua cơ chế DI của Awilix.
 */
export interface IChapterControllerCradle {
    /** @description Dịch vụ thực hiện các thao tác thay đổi dữ liệu (Create, Update, Delete). */
    chapterService: IChapterService;

    /** @description Dịch vụ chuyên trách các thao tác truy vấn và đọc dữ liệu. */
    chapterQueryService: IChapterQueryService;
}

/**
 * @class ChapterController
 * @description Lớp điều phối các yêu cầu HTTP liên quan đến quản lý Chương lý thuyết (Chapters).
 * @principle Separation of Concerns - Tách biệt rõ ràng luồng ghi (Command) và luồng đọc (Query) để tối ưu hóa hiệu năng và khả năng bảo trì. (Explicitly separates Write and Read flows).
 */
export class ChapterController {
    /** @private @readonly @description Instance xử lý các logic thay đổi trạng thái chương. */
    private readonly _chapterService: IChapterService;

    /** @private @readonly @description Instance xử lý các yêu cầu truy vấn thông tin chương. */
    private readonly _chapterQueryService: IChapterQueryService;

    /**
     * @constructor
     * @description Khởi tạo Controller bằng cách giải nén các phụ thuộc từ Cradle.
     * @param {IChapterControllerCradle} cradle - Chứa các dịch vụ Application cần thiết.
     */
    constructor({ chapterService, chapterQueryService }: IChapterControllerCradle) {
        this._chapterService = chapterService;
        this._chapterQueryService = chapterQueryService;
    }

    /**
     * @description Truy vấn danh sách toàn bộ chương lý thuyết trong hệ thống.
     * @route GET /api/v1/chapters
     * @returns {Promise<void>} Phản hồi danh sách ChapterResponseDTO.
     */
    public list = catchAsync(async (req: Request, res: Response) => {

        const query = new ChapterQueryDTO(req.query as Record<string, unknown>);
        const response = await this._chapterQueryService.getPaginatedChapters(query);

        Result.ok(
            res,
            response,
            Message.CHAPTER.FETCH_SUCCESS,
            'CHAPTER_GET_SUCCESS'
        );
    });

    /**
     * @description Khởi tạo một chương lý thuyết mới vào cơ sở dữ liệu.
     * @route POST /api/v1/chapters
     * @param {Request} req - Chứa CreateChapterDTO trong body.
     * @returns {Promise<void>} Phản hồi thông tin chương vừa được tạo.
     */
    public create = catchAsync(async (req: Request, res: Response) => {
        const dto = new CreateChapterRequestDTO(req.body)
        const result = await this._chapterService.createChapter(dto);

        Result.ok(
            res,
            result,
            Message.CHAPTER.CREATE_SUCCESS,
            'CHAPTER_CREATE_SUCCESS'
        );
    });

    /**
     * @description Cập nhật nội dung chi tiết hoặc thay đổi thứ tự hiển thị (orderIndex) của chương.
     * @route PATCH /api/v1/chapters/:id
     * @param {Request} req - Chứa UpdateChapterDTO trong body và ID trên params.
     * @returns {Promise<void>} Phản hồi thông tin chương sau khi cập nhật.
     */
    public update = catchAsync(async (req: Request, res: Response) => {
        const id = req.params.id as string;
        const dto = new UpdateChapterRequestDTO({ id, ...req.body })
        const result = await this._chapterService.updateChapter(id, dto);

        Result.ok(
            res,
            result,
            Message.CHAPTER.UPDATE_SUCCESS,
            'CHAPTER_UPDATE_SUCCESS'
        );
    });

    /**
     * @description Thực hiện xóa mềm (Soft Delete) chương lý thuyết dựa trên ID.
     * @route DELETE /api/v1/chapters/:id
     * @returns {Promise<void>}
     */
    public delete = catchAsync(async (req: Request, res: Response) => {
        const id = req.params.id as string;
        const result = await this._chapterService.deleteChapter(id);

        Result.ok(
            res,
            result,
            Message.CHAPTER.DELETE_SUCCESS,
            'CHAPTER_DELETE_SUCCESS'
        );
    });

    /**
     * @description Khôi phục lại trạng thái hoạt động cho chương lý thuyết đã bị xóa mềm.
     * @route PATCH /api/v1/chapters/:id/restore
     * @returns {Promise<void>} Phản hồi thông tin chương sau khi khôi phục.
     */
    public restore = catchAsync(async (req: Request, res: Response) => {
        const id = req.params.id as string;
        const result = await this._chapterService.restoreChapter(id);

        Result.ok(
            res,
            result,
            Message.CHAPTER.RESTORE_SUCCESS,
            'CHAPTER_RESTORE_SUCCESS'
        );
    });


    /**
     * @description Lấy danh sách các chương học định dạng selection (value/label) có hỗ trợ tìm kiếm và phân trang.
     * @route GET /api/v1/master-data/chapters/selection
     * @param {Response} res - Đối tượng Response của Express.
     * @returns {Promise<void>} Phản hồi danh sách chương dạng { items, meta }.
     */
    public getChapterSelections = catchAsync(async (_req: Request, res: Response) => {
        const result = await this._chapterQueryService.getChapterSelections();

        Result.ok(
            res,
            result,
            Message.CHAPTER.GET_SELECTION_SUCCESS,
            'CHAPTER_SELECTION_SUCCESS'
        );
    });
}