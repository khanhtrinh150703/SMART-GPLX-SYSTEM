import { ExamEntity } from "@/domain/entities/exam/exam.entity";
import { IExamRepository } from "@/domain/interfaces/repositories/exam-mgmt/i-exam.repository";
import { AppError, ErrorCode } from "@/shared/errors";
import { ExamMapper } from "@/infrastructure/database/mappers/exam-mgmt/exam.mapper";
import { IExamGeneratorService } from "@/domain/interfaces/services/exam-engine/commands/i-exam-generator.service";
import { IMasterDataCacheService } from "@/domain/interfaces/services/exam-mgmt/commands/i-master-data-cache.service";
import { GenerateExamDTO } from "@/application/dtos/request/exam/generate-exam.request.dto";
import { IExamResponseDTO } from "@/application/dtos/response/exam/exam.response.dto";
import { IExamPickerDomainService } from "@/domain/interfaces/services/exam-engine/commands/i-exam-picker.service";
import { LICENSE_HIERARCHY } from "@/domain/constants/license-hierarchy.constant";
import { IExamMatrixQueryService } from "@/domain/interfaces/services/exam-session/queries";
import { IQuestionQueryService } from "@/domain/interfaces/services/exam-mgmt/queries";
import { Question } from "@/domain/entities/question/question.entity";

/**
 * @interface IExamGeneratorServiceCradle
 * @description Tập hợp các phụ thuộc (Dependencies) cần thiết cho quy trình sinh đề thi tự động.
 */
export interface IExamGeneratorServiceCradle {
  /** @description Repository lưu trữ thực thể đề thi sau khi khởi tạo thành công. */
  examRepository: IExamRepository;

  /** @description Dịch vụ cache giúp truy xuất nhanh các cấu hình và tham số hệ thống. */
  masterDataCacheService: IMasterDataCacheService;

  /** @description Domain Service chứa thuật toán cốt lõi để lựa chọn câu hỏi dựa trên tiêu chí. */
  examPickerService: IExamPickerDomainService;

  /** @description Dịch vụ truy xuất ma trận đề thi (cấu trúc số lượng câu hỏi theo chương/loại). */
  examMatrixQueryService: IExamMatrixQueryService;

  /** @description Dịch vụ cung cấp danh sách câu hỏi thô từ ngân hàng dữ liệu. */
  questionQueryService: IQuestionQueryService;
}

/**
 * @class ExamGeneratorService
 * @description Application Service điều phối quy trình tạo đề thi: lấy ma trận, chọn câu hỏi qua thuật toán và lưu trữ kết quả.
 * @principle Algorithmic Orchestration - Đảm bảo tính ngẫu nhiên và đúng quy định pháp luật thông qua việc kết hợp Ma trận và Domain Picker.
 */
export class ExamGeneratorService implements IExamGeneratorService {
  /** @private @readonly @description Repo lưu trữ kết quả. */
  private readonly _examRepo: IExamRepository;

  /** @private @readonly @description Bộ nhớ đệm tham số. */
  private readonly _cacheService: IMasterDataCacheService;

  /** @private @readonly @description Thuật toán chọn câu hỏi (Domain logic). */
  private readonly _examPickerService: IExamPickerDomainService;

  /** @private @readonly @description Truy vấn cấu trúc đề. */
  private readonly _examMatrixQueryService: IExamMatrixQueryService;

  /** @private @readonly @description Truy vấn ngân hàng câu hỏi. */
  private readonly _questionQueryService: IQuestionQueryService;

  /**
   * @constructor
   * @description Khởi tạo dịch vụ sinh đề với sự phối hợp của nhiều lớp truy vấn và xử lý thuật toán.
   * @param {IExamGeneratorServiceCradle} cradle - Chứa các công cụ cần thiết để lắp ráp một đề thi hoàn chỉnh.
   */
  constructor({
    examRepository,
    masterDataCacheService,
    examPickerService,
    examMatrixQueryService,
    questionQueryService,
  }: IExamGeneratorServiceCradle) {
    this._examRepo = examRepository;
    this._cacheService = masterDataCacheService;
    this._examPickerService = examPickerService;
    this._examMatrixQueryService = examMatrixQueryService;
    this._questionQueryService = questionQueryService;
  }

  /**
   * @description Tự động tạo đề thi dựa trên ma trận đề (Matrix).
   * @param {GenerateExamDTO} dto - Dữ liệu yêu cầu generate.
   * @returns {Promise<IExamResponseDTO>} Đề thi đã được tạo và lưu trữ.
   * @throws {AppError} EXAM.NOT_FOUND - Khi không tìm thấy cấu trúc/ma trận đề thi tương ứng trong hệ thống. (Exam matrix not found).
   */
  public async generate(dto: GenerateExamDTO): Promise<IExamResponseDTO> {
    const matrix = await this._examMatrixQueryService.getById(dto.matrixId);
    if (!matrix) throw new AppError(ErrorCode.EXAM.NOT_FOUND);

    const category = this._cacheService.getCategoryById(
      matrix.props.licenseCategoryId,
    );
    if (!category) throw new AppError(ErrorCode.LICENSE.NOT_FOUND);

    let questionEntities: Question[] = [];

    // Rẽ nhánh logic bốc kho câu hỏi dựa trên kiểu Ma trận
    if (matrix.props.isChapter) {
      // 🚀 LUỒNG BỐC TỰ DO THEO CHƯƠNG: Gom hết chapterId trong chi tiết ma trận ra
      const chapterIds = matrix.props.details.map((detail) => detail.chapterId);

      // Query thẳng từ kho câu hỏi theo các chương này, bỏ qua hoàn toàn License
      questionEntities =
        await this._questionQueryService.getByChapterIds(chapterIds);
    } else {
      // 🛡️ LUỒNG THI THẬT THEO HẠNG BẰNG: Giữ nguyên logic Heuristic cũ
      // 2. Xử lý phân cấp bằng lái (License Hierarchy)
      const subLicenses = Array.from(
        new Set([category.name, ...(LICENSE_HIERARCHY[category.name] || [])]),
      );

      // 3. Lấy kho câu hỏi theo danh sách Hạng bằng
      questionEntities =
        await this._questionQueryService.getByLicenseCategoryIds(subLicenses);
    }

    // Sau khi có questionEntities thì ném cho thằng PickerService xử lý trộn theo % như cũ...
    const pickedEntities = this._examPickerService.execute(
      questionEntities,
      matrix.props,
    );

    // 4. Khởi tạo thực thể Exam qua Factory Method
    // Để Entity tự xử lý Snapshot mapping, Invariants check và totalQuestions
    const exam = ExamEntity.create({
      name: dto.name,
      userId: dto.userId,
      examMatrixId: dto.matrixId,
      licenseCategoryId: matrix.props.licenseCategoryId,
      totalQuestions: matrix.props.totalQuestions, // Fallback sẽ là length của pickedEntities
      durationMinutes: matrix.props.durationMinutes,
      passingScore: matrix.props.passingScore,
      isChapter: matrix.props.isChapter,
      minCriticalQuestions: matrix.props.minCriticalQuestions,
      rawQuestions: pickedEntities, // Truyền entity thô để Domain tự "nấu" snapshot
      status: dto.status,
    });

    // 5. Persistence & Mapping
    const savedExam = await this._examRepo.createExam(exam);

    return ExamMapper.toResponse(savedExam);
  }
}
