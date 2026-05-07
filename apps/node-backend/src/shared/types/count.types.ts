/** 
 * @description Chi tiết các bản ghi liên quan đến Hạng bằng lái.
 * (Details of records related to License Category.)
 */
export type LicenseRelatedCount = {
  questions: number;
  matrices: number;
  exams: number;
  attempts: number;
};

/** 
 * @description Chi tiết các bản ghi liên quan đến Chương.
 * (Details of records related to Chapter.)
 */
export type ChapterRelatedCount = {
  questions: number;
  matrixDetails: number;
  userWeaknesses: number;
};

/** 
 * @description Chi tiết các bản ghi liên quan đến Đề thi.
 * (Details of records related to Exam.)
 */
export type ExamRelatedCount = {
  questions: number;
};

/** 
 * @description Chi tiết các bản ghi liên quan đến Người dùng.
 * (Details of records related to User.)
 */
export type UserRelatedCount = {
  userRoles: number;
};

/** 
 * @description Chi tiết các bản ghi liên quan đến Câu hỏi.
 * (Details of records related to Question.)
 */
export type QuestionRelatedCount = {
  chapter: number;
  licenseLinks: number;
  examQuestions: number;
};