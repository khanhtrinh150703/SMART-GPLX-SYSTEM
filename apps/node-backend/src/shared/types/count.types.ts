/** @description Chi tiết các bản ghi liên quan đến Hạng bằng lái */
export type LicenseRelatedCount = {
  questions: number;
  matrices: number;
  exams: number;
  attempts: number;
};

/** @description Chi tiết các bản ghi liên quan đến Chương */
export type ChapterRelatedCount = {
  questions: number;
  matrixDetails: number;
  userWeaknesses: number;
};