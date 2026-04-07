import { Request, Response } from 'express';
import { ICradle } from '@/shared/types/container.types';
import { Result } from '@/shared/responses/api-response';
import { Message } from '@/shared/errors/messages/success-messages-vn';
import { IChapterService } from '@/domain/interfaces/services/i-chapter.service';
import { catchAsync } from '@/shared/utils/catch-async.utils';
import { ChapterQueryDTO } from '@/application/dtos/request/chapter/chapter-query.request.dto';

/**
 * @description Controller xử lý các yêu cầu HTTP liên quan đến quản lý Chương lý thuyết (Theory Chapters).
 * Đảm nhận vai trò điều phối giữa yêu cầu từ Client và logic nghiệp vụ tại Application Service.
 */
export class ChapterController {
    private readonly _chapterService: IChapterService;

    constructor({ chapterService }: ICradle) {
        this._chapterService = chapterService;
    }

    /**
     * @description Truy vấn danh sách toàn bộ chương lý thuyết trong hệ thống.
     * @route GET /api/v1/chapters
     * @returns {Promise<void>} Phản hồi danh sách ChapterResponseDTO.
     */
    public list = catchAsync(async (req: Request, res: Response) => {

        const query: ChapterQueryDTO = req.query as unknown as ChapterQueryDTO;
        const response = await this._chapterService.getPaginatedChapters(query);

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
        const result = await this._chapterService.createChapter(req.body);

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
        const { id } = req.params;
        const result = await this._chapterService.updateChapter({ ...req.body, id });

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
        await this._chapterService.deleteChapter(id);

        Result.ok(
            res,
            undefined,
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
}