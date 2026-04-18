import { STORAGE_CONFIG } from '@/shared/config/storage.config';
import { IImportJobRepository } from '@/domain/interfaces/repositories/i-import-job.repository';
import { IExcelService } from '@/domain/interfaces/services/i-excel.service';
import { IImportProcessorService } from '@/domain/interfaces/services/i-import-processor.service';
import { IZipService } from '@/domain/interfaces/services/i-zip.service';
import { AppError, ErrorCode } from '@/shared/errors';
import { QuestionService } from './question.service';
import { MasterDataCacheService } from '@/infrastructure/security/master-data-cache.service';
import { ImportMapper } from '@/infrastructure/database/mappers/import.mapper';
import path from 'node:path';
import fs from 'node:fs/promises';

// ============================================================================
// LỚP LỖI TÙY CHỈNH (Custom Error Class)
// Lưu ý: Trong thực tế nên tách class này ra file riêng ở thư mục shared/errors
// ============================================================================
export class RowValidationError extends Error {
    public readonly details: string[];

    constructor(defaultMessage: string, details: string[]) {
        super(defaultMessage);
        this.name = 'RowValidationError';
        this.details = details;
    }

    public getCombinedMessage(): string {
        return `${this.message}: ${this.details.join(', ')}`;
    }
}

// ============================================================================
// DEPENDENCIES & SERVICE
// ============================================================================
interface ImportProcessorDependencies {
    importJobRepository: IImportJobRepository;
    questionService: QuestionService;
    zipService: IZipService;
    excelService: IExcelService;
}

export class ImportProcessorService implements IImportProcessorService {
    private readonly _importRepo: IImportJobRepository;
    private readonly _questionService: QuestionService;
    private readonly _zipService: IZipService;
    private readonly _excelService: IExcelService;

    constructor({
        importJobRepository,
        questionService,
        zipService,
        excelService
    }: ImportProcessorDependencies) {
        this._importRepo = importJobRepository;
        this._questionService = questionService;
        this._zipService = zipService;
        this._excelService = excelService;
    }

    public async process(jobId: string, zipPath: string): Promise<void> {
        const { EXCEL_NAME, IMAGE_FOLDER } = STORAGE_CONFIG.IMPORT_CONVENTION;
        const extractedDir = path.join(STORAGE_CONFIG.TEMP_DIR, jobId);

        const job = await this._importRepo.findById(jobId);
        if (!job) {
            throw new AppError(ErrorCode.IMPORT.JOB_NOT_FOUND);
        }

        try {
            // --- BƯỚC A: GIẢI NÉN ZIP (STEP A: EXTRACT ZIP) ---
            job.updateStep('EXTRACTING');
            await this._importRepo.save(job);
            await this._zipService.extract(zipPath, extractedDir);

            // --- BƯỚC B: ĐỌC EXCEL (STEP B: READ EXCEL) ---
            job.updateStep('VALIDATING_EXCEL');
            const excelPath = path.join(extractedDir, EXCEL_NAME);
            const rawRows = await this._excelService.readQuestions(excelPath);

            const total = rawRows.length;
            job.updateProgress(total, 0, 0, 0);
            await this._importRepo.save(job);

            // --- BƯỚC C: XỬ LÝ TỪNG DÒNG (STEP C: PROCESS EACH ROW) ---
            for (let i = 0; i < total; i++) {
                const rowData = rawRows[i];
                const currentRow = i + 1;

                try {
                    // 1. GOM LỖI DỮ LIỆU (DATA VALIDATION & ERROR ACCUMULATION)
                    const rowErrors: string[] = [];
                    const mappedCategoryIds: string[] = [];
                    let mappedChapterId: string = '';

                    // 1.1 Kiểm tra Text cơ bản (Basic Text Validation)
                    if (!rowData.licenseCategory) {
                        rowErrors.push('Cột "Hạng bằng lái" để trống');
                    }
                    if (!rowData.chapter) {
                        rowErrors.push('Cột "Chương" để trống');
                    }
                    if (!rowData.content || String(rowData.content).trim() === '') {
                        rowErrors.push('Nội dung câu hỏi bị trống');
                    }
                    if (!rowData.correctAnswerIndex || isNaN(Number(rowData.correctAnswerIndex))) {
                        rowErrors.push('Cột "Đáp án đúng" bị trống hoặc không phải là số');
                    }

                    // 1.2 Kiểm tra sự tồn tại của File Ảnh (Image File Existence Check)
                    if (rowData.questionImage) {
                        const questionImagePath = path.join(extractedDir, IMAGE_FOLDER, rowData.questionImage);
                        try {
                            await fs.access(questionImagePath);
                        } catch {
                            rowErrors.push(`Ảnh câu hỏi "${rowData.questionImage}" không tìm thấy trong thư mục ảnh`);
                        }
                    }

                    if (rowData.rawAnswers && Array.isArray(rowData.rawAnswers)) {
                        for (let j = 0; j < rowData.rawAnswers.length; j++) {
                            const ansImage = rowData.rawAnswers[j].image;
                            if (ansImage) {
                                const ansImagePath = path.join(extractedDir, IMAGE_FOLDER, ansImage);
                                try {
                                    await fs.access(ansImagePath);
                                } catch {
                                    rowErrors.push(`Ảnh của đáp án ${j + 1} ("${ansImage}") không tìm thấy trong thư mục ảnh`);
                                }
                            }
                        }
                    }

                    // 1.3 Kiểm tra dữ liệu Mapping với Database (Database Mapping Validation)
                    if (rowData.licenseCategory) {
                        const categoryNames = rowData.licenseCategory
                            .split(',')
                            .map((name: string) => name.trim())
                            .filter((name: string) => name.length > 0);

                        for (const name of categoryNames) {
                            const category = MasterDataCacheService.getCategoryByExcelName(name);
                            if (!category) {
                                rowErrors.push(`Hạng bằng "${name}" không tồn tại trong hệ thống`);
                            } else {
                                mappedCategoryIds.push(category.id);
                            }
                        }
                    }

                    if (rowData.chapter) {
                        const mappedChapter = MasterDataCacheService.getChapterByExcelCode(rowData.chapter);
                        if (!mappedChapter) {
                            rowErrors.push(`Chương mã "${rowData.chapter}" không tồn tại trong hệ thống`);
                        } else {
                            mappedChapterId = mappedChapter.id;
                        }
                    }

                    // ==========================================
                    // CHỐT CHẶN CUỐI CÙNG (THE FINAL BARRIER)
                    // ==========================================
                    if (rowErrors.length > 0) {
                        throw new RowValidationError('Dữ liệu không hợp lệ', rowErrors);
                    }

                    // ==========================================
                    // TỪ ĐÂY TRỞ XUỐNG DỮ LIỆU ĐÃ CHẮC CHẮN SẠCH 100%
                    // ==========================================

                    // 2. TẠO COMMAND & LƯU DB (CREATE COMMAND & SAVE TO DB)
                    const importCommand = ImportMapper.toImportCommand(
                        rowData,
                        extractedDir,
                        mappedChapterId,
                        mappedCategoryIds
                    );

                    await this._questionService.createFromImport(importCommand);

                    job.updateProgress(
                        total,
                        currentRow,
                        job.props.resultData.successCount + 1,
                        job.props.resultData.errorCount
                    );

                } catch (rowError) {
                    // 3. PHÂN LOẠI LỖI (CATEGORIZE ERROR)
                    let errorType = 'General';
                    let finalMessage = 'Lỗi không xác định';

                    if (rowError instanceof RowValidationError) {
                        errorType = 'Validation';
                        finalMessage = rowError.getCombinedMessage();
                    } else if (rowError instanceof Error) {
                        errorType = 'System'; // Đổi thành System vì lúc này Mapping logic đã an toàn, lỗi văng ở đây thường do DB.
                        finalMessage = rowError.message;
                    }

                    job.addError(currentRow, finalMessage, errorType);

                    job.updateProgress(
                        total,
                        currentRow,
                        job.props.resultData.successCount,
                        job.props.resultData.errorCount + 1
                    );
                }

                // Lưu trạng thái xuống DB mỗi 10 câu (Save state to DB every 10 rows)
                if (currentRow % 10 === 0 || currentRow === total) {
                    await this._importRepo.save(job);
                }
            }

            // --- BƯỚC D: HOÀN TẤT (STEP D: COMPLETE) ---
            job.markAsCompleted();
            await this._importRepo.save(job);

        } catch (globalError) {
            // Lỗi hệ thống khẩn cấp (Critical system error)
            job.updateProgress(
                job.props.resultData.totalRows,
                job.props.resultData.processedRows,
                job.props.resultData.successCount,
                job.props.resultData.errorCount
            );
            await this._importRepo.save(job);
            throw globalError;

        } finally {
            // --- BƯỚC E: DỌN DẸP (STEP E: CLEANUP) ---
            // Dọn dẹp cả file ZIP gốc và folder giải nén
            await this._zipService.cleanup(zipPath);
            await this._zipService.cleanup(extractedDir);
        }
    }
}