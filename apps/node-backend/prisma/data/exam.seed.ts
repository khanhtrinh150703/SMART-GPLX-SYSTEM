import { IExamSeed } from "./interface.seed";

export const mockExams: IExamSeed[] = [
  {
    name: "Đề thi mẫu Hạng A1 - Số 01",
    // 🎯 Đọc động từ biến môi trường admin email đã thiết lập ở file .env
    userEmail: process.env.SEED_ADMIN_EMAIL || "admin@smartgplx.com", 
    licenseName: "A1",
    isChapter: false,
    totalQuestions: 25,
    passingScore: 21,
    durationMinutes: 19,
    minCriticalQuestions: 1
  },
  {
    name: "Đề thi mẫu Hạng A1 - Số 02",
    // 🎯 Đồng bộ tương tự cho toàn bộ các đề thi mẫu khác
    userEmail: process.env.SEED_ADMIN_EMAIL || "admin@smartgplx.com",
    licenseName: "A1",
    isChapter: false,
    totalQuestions: 25,
    passingScore: 21,
    durationMinutes: 19,
    minCriticalQuestions: 1
  }
];