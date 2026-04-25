import { IImportJobRepository } from '@/domain/interfaces/repositories/integration/i-import-job.repository';
import { IExcelService } from '@/domain/interfaces/services/integration/i-excel.service';
import { IImportProcessorService } from '@/domain/interfaces/services/integration/i-import-processor.service';
import { IZipService } from '@/domain/interfaces/services/integration/i-zip.service';
import { IMasterDataCacheService } from '@/domain/interfaces/services/exam-mgmt/i-master-data-cache.service';
import { ImportJobEntity } from '@/domain/entities/import/import-job.entity';
import { RowValidationError } from '@/shared/errors/row-validation.error';
import { AppError, ErrorCode } from '@/shared/errors';
import { STORAGE_CONFIG } from '@/shared/config/storage.config';
import { QuestionImportEntity } from '@/domain/entities/import/import-question.entity';
import path from 'node:path';
import { IRawQuestion } from '@/domain/entities/import/raw-question.props';
import { QuestionService } from '../exam-mgmt';

interface ImportProcessorDependencies {
  importJobRepository: IImportJobRepository;
  questionService: QuestionService;
  zipService: IZipService;
  excelService: IExcelService;
  masterDataCacheService: IMasterDataCacheService;
}

/**
 * @description Service điều phối luồng Import dữ liệu (Application Service).
 */
export class ImportProcessorService implements IImportProcessorService {
  private readonly _importRepo: IImportJobRepository;
  private readonly _questionService: QuestionService;
  private readonly _zipService: IZipService;
  private readonly _excelService: IExcelService;
  private readonly _cacheService: IMasterDataCacheService;

  constructor({
    importJobRepository,
    questionService,
    zipService,
    excelService,
    masterDataCacheService
  }: ImportProcessorDependencies) {
    this._importRepo = importJobRepository;
    this._questionService = questionService;
    this._zipService = zipService;
    this._excelService = excelService;
    this._cacheService = masterDataCacheService;
  }

  /**
   * @description Quy trình giải nén và xử lý dữ liệu hàng loạt từ file ZIP.
   * @param {string} jobId - ID của tiến trình xử lý (Queue Job).
   * @param {string} zipPath - Đường dẫn file ZIP đầu vào.
   * @returns {Promise<void>}
   */
  public async process(jobId: string, zipPath: string): Promise<void> {
    const extractedDir = this._zipService.getExtractionPath(jobId);
    const job = await this._getValidatedJob(jobId);

    try {
      // 1. Giải nén
      await this._prepareImportData(job, zipPath, extractedDir);

      // 2. Đọc file Excel
      const excelPath = this._excelService.buildExcelPath(
        extractedDir,
        STORAGE_CONFIG.IMPORT_CONVENTION.EXCEL_NAME
      );
      const rawQuestions = await this._excelService.readQuestions(excelPath);

      // 3. Xử lý batch
      await this._runBatchProcessing(job, rawQuestions, extractedDir);

      job.markAsCompleted();
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Lỗi hệ thống không xác định';
      job.markAsFailed(message);
      throw error;
    } finally {
      await this._importRepo.updateImportJob(job);
      await this._cleanupResources(zipPath, extractedDir);
    }
  }

  /**
   * @description Thực thi xử lý dữ liệu hàng loạt, chuyển đổi raw sang domain và lưu vào DB.
   * @param {ImportJobEntity} job - Thực thể quản lý tiến trình import.
   * @param {IRawQuestion[]} rawQuestions - Mảng dữ liệu câu hỏi thô từ Excel.
   * @param {string} extractedDir - Thư mục chứa tài nguyên ảnh đã giải nén.
   * @returns {Promise<void>}
   */
  private async _runBatchProcessing(
    job: ImportJobEntity,
    rawQuestions: IRawQuestion[],
    extractedDir: string
  ): Promise<void> {
    const { IMAGE_FOLDER } = STORAGE_CONFIG.IMPORT_CONVENTION;

    for (const raw of rawQuestions) {
      try {
        // 1. Ánh xạ ID từ Master Data (Cache)
        const { categoryIds, chapterId } = this._mapMasterDataIds(raw);

        // 2. Chuẩn hóa đường dẫn ảnh
        const questionImagePath = raw.questionImage
          ? path.join(extractedDir, IMAGE_FOLDER, raw.questionImage)
          : undefined;

        // 3. Khởi tạo Entity và Tự động Validate
        const questionEntity = QuestionImportEntity.create({
          indexNumber: raw.indexNumber,
          content: raw.content,
          chapterId: chapterId,
          licenseCategoryIds: categoryIds,
          difficultyLevel: raw.difficultyLevel,
          isCritical: raw.isCriticalRaw,
          questionImage: questionImagePath,
          correctAnswerIndex: raw.correctAnswerIndex,
          aiExplainDraft: raw.aiExplainDraft,
          answers: raw.rawAnswers.map((ans, idx) => ({
            text: ans.text,
            image: ans.image ? path.join(extractedDir, IMAGE_FOLDER, ans.image) : undefined,
            isCorrect: (idx + 1) === raw.correctAnswerIndex,
          })),
        });

        // 4. Kiểm tra file vật lý & Lưu DB thông qua QuestionService
        await this._excelService.validateImagesExist(questionEntity.props);
        await this._questionService.createFromImport(questionEntity);

        job.incrementSuccessCount();
      } catch (error: unknown) {
        this._logRowError(job, raw.indexNumber, error);
      }
    }
  }

  /**
   * @description Ánh xạ tên danh mục và mã chương từ Excel sang ID thực tế trong Database.
   * @param {IRawQuestion} rowData - Dữ liệu thô của một dòng câu hỏi.
   * @returns {{ categoryIds: string[], chapterId: string }} Đối tượng chứa danh sách ID hạng bằng và ID chương.
   */
  private _mapMasterDataIds(rowData: IRawQuestion): { categoryIds: string[], chapterId: string } {
    const categoryIds = rowData.licenseCategory
      .map(name => this._cacheService.getCategoryByExcelName(name)?.id)
      .filter((id): id is string => !!id);

    const chapterId = this._cacheService.getChapterByExcelCode(rowData.chapter)?.id || '';

    return { categoryIds, chapterId };
  }

  /**
   * @description Ghi nhận và phân loại lỗi chi tiết xảy ra tại từng dòng trong quá trình Import.
   * @param {ImportJobEntity} job - Thực thể quản lý tiến trình để cập nhật danh sách lỗi.
   * @param {number} index - Vị trí dòng (số thứ tự) bị lỗi trong file.
   * @param {unknown} error - Đối tượng lỗi bắt được từ hệ thống hoặc validation.
   * @returns {void}
   */
  private _logRowError(job: ImportJobEntity, index: number, error: unknown): void {
    let message = 'Lỗi không xác định';
    let details: string[] = [];
    let column = 'Hệ thống';

    if (error instanceof RowValidationError) {
      message = error.message;
      details = error.details;
      column = error.column;
    } else if (error instanceof Error) {
      message = error.message;
    }

    job.addErrorLog(index, message, column, details);
  }

  /**
   * @description Chuẩn bị dữ liệu: Cập nhật trạng thái và giải nén file ZIP vào thư mục tạm.
   * @param {ImportJobEntity} job - Thực thể tiến trình import.
   * @param {string} zipPath - Đường dẫn file ZIP.
   * @param {string} extractedDir - Thư mục đích để giải nén.
   * @returns {Promise<void>}
   */
  private async _prepareImportData(job: ImportJobEntity, zipPath: string, extractedDir: string): Promise<void> {
    job.updateStep('EXTRACTING');
    await this._importRepo.updateImportJob(job);
    await this._zipService.extract(zipPath, extractedDir);
    job.updateStep('PROCESSING');
    await this._importRepo.updateImportJob(job);
  }

  /**
   * @description Lấy thông tin tiến trình và kiểm tra sự tồn tại trong Database.
   * @param {string} jobId - ID của tiến trình cần lấy.
   * @returns {Promise<ImportJobEntity>} Thực thể tiến trình hợp lệ.
   * @throws {AppError} IMPORT.JOB_NOT_FOUND nếu không tìm thấy ID.
   */
  private async _getValidatedJob(jobId: string): Promise<ImportJobEntity> {
    const job = await this._importRepo.findById(jobId);
    if (!job) throw new AppError(ErrorCode.IMPORT.JOB_NOT_FOUND);
    return job;
  }

  /**
   * @description Dọn dẹp tài nguyên (file ZIP và thư mục tạm) sau khi hoàn tất hoặc lỗi.
   * @param {string} zipPath - Đường dẫn file ZIP cần xóa.
   * @param {string} extractedDir - Thư mục tạm cần xóa.
   * @returns {Promise<void>}
   */
  private async _cleanupResources(zipPath: string, extractedDir: string): Promise<void> {
    try {
      await this._zipService.cleanup(zipPath);
      await this._zipService.cleanup(extractedDir);
    } catch (e) {
      // Log nhưng không chặn luồng chính
      console.error('Cleanup failed:', e);
    }
  }
}