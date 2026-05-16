import { IBaseProps } from "@/domain/seedwork/entity.base";

/**
 * @interface IUserStatisticsProps
 * @description Thuộc tính lõi của Aggregate Root Thống kê người dùng.
 * Quản lý hiệu suất thi cử, tốc độ làm bài và các kỷ lục cá nhân.
 */
export interface IUserStatisticsProps extends IBaseProps {
  /** @description ID người dùng | User Identifier */
  userId: string;

  // --- NHÓM CHỈ SỐ TỔNG QUAN (GENERAL METRICS) ---
  /** @description Tổng số bài thi đã thực hiện */
  totalExams: number;
  /** @description Số bài thi đạt kết quả Đạt */
  passedExams: number;
  /** @description Số bài thi kết quả Không Đạt */
  failedExams: number;
  /** @description Số lần trượt vì sai câu điểm liệt | Failed by critical/lethal questions */
  failedByCritical: number;

  // --- NHÓM CÂU HỎI & ĐỘ CHÍNH XÁC (ACCURACY) ---
  /** @description Tổng số câu hỏi đã trả lời tích lũy */
  totalQuestionsAnswered: number;
  /** @description Tổng số câu trả lời đúng */
  totalCorrectAnswers: number;
  /** @description Tổng số câu trả lời sai */
  totalWrongAnswers: number;
  /** @description Tổng số câu bỏ trống (không trả lời) */
  totalUnanswered: number;

  // --- NHÓM ĐIỂM SỐ & KỶ LỤC (RECORDS) ---
  /** @description Điểm trung bình cộng (Quy về hệ % hoặc số câu) */
  averageScore: number;

  /** @description Điểm số cao nhất | High Score */
  highScore: number;
  /** @description ID bài thi đạt điểm cao nhất */
  highScoreExamId: string | null;
  /** @description Tên bài thi đạt điểm cao nhất */
  highScoreExamName: string | null;

  /** @description Điểm số thấp nhất | Low Score */
  lowScore: number;
  /** @description ID bài thi điểm thấp nhất */
  lowScoreExamId: string | null;
  /** @description Tên bài thi điểm thấp nhất */
  lowScoreExamName: string | null;

  // --- NHÓM THỜI GIAN (TIME METRICS - Seconds) ---
  /** @description Thời gian làm bài trung bình */
  averageDuration: number;
  
  /** @description Thời gian làm bài nhanh nhất */
  fastestDuration: number;
  /** @description ID bài thi làm nhanh nhất */
  fastestExamId: string | null;
  /** @description Tên bài thi làm nhanh nhất */
  fastestExamName: string | null;

  /** @description Thời gian làm bài chậm nhất */
  slowestDuration: number;

  // --- NHÓM PHONG ĐỘ & XẾP HẠNG (RANK & STREAKS) ---
  /** @description Chuỗi ngày/bài thi đạt liên tiếp hiện tại */
  currentStreak: number;
  /** @description Chuỗi đạt liên tiếp dài nhất từng có */
  maxStreak: number;
  /** @description Xếp hạng năng lực hiện tại (VD: "Tay lái lụa", "Newbie") */
  currentRank: string | null;

  /** @description Mốc thời gian làm bài thi cuối cùng */
  lastExamAt: Date;
}

/**
 * @description DTO khởi tạo Thống kê người dùng.
 * Sử dụng để tạo bản ghi trắng khi người dùng mới bắt đầu thi lần đầu.
 */
/** 
 * Nhìn cái DTO khởi tạo bây giờ nó sạch như này này
 */
export type CreateUserStatisticsRequestProps = Pick<IUserStatisticsProps, 'userId'>;