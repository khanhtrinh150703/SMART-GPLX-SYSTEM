import { MatrixSeed } from "../interface.seed";

export const examMatrices: MatrixSeed[] = [
  // 1. Hạng A1 (Dưới 125 cm3)
  {
    name: "Ma trận chuẩn Hạng A1 (Mới)",
    licenseName: "A1",
    totalQuestions: 25,
    passingScore: 21,
    durationMinutes: 19,
    minCriticalQuestions: 1,
    isDefault: true,
    details: [
      { chapterCode: '1', percentage: 40 },
      { chapterCode: '5', percentage: 30 },
      { chapterCode: '6', percentage: 30 },
    ]
  },
  // 2. Hạng A (Trên 125 cm3)
  {
    name: "Ma trận chuẩn Hạng A (Mới)",
    licenseName: "A",
    totalQuestions: 25,
    passingScore: 23,
    durationMinutes: 19,
    minCriticalQuestions: 1,
    isDefault: true,
    details: [
      { chapterCode: '1', percentage: 40 },
      { chapterCode: '5', percentage: 30 },
      { chapterCode: '6', percentage: 30 },
    ]
  },
  // 3. Hạng B1 (Xe mô tô 3 bánh)
  {
    name: "Ma trận chuẩn Hạng B1 (Mới)",
    licenseName: "B1",
    totalQuestions: 25,
    passingScore: 23,
    durationMinutes: 19,
    minCriticalQuestions: 1,
    isDefault: true,
    details: [
      { chapterCode: '1', percentage: 40 },
      { chapterCode: '5', percentage: 30 },
      { chapterCode: '6', percentage: 30 },
    ]
  },
  // 4. Hạng B (Ô tô đến 8 chỗ, tải đến 3.500kg)
  {
    name: "Ma trận chuẩn Hạng B (Mới)",
    licenseName: "B",
    totalQuestions: 35,
    passingScore: 32,
    durationMinutes: 22,
    minCriticalQuestions: 1,
    isDefault: true,
    details: [
      { chapterCode: '1', percentage: 30 },
      { chapterCode: '3', percentage: 10 },
      { chapterCode: '4', percentage: 10 },
      { chapterCode: '5', percentage: 25 },
      { chapterCode: '6', percentage: 25 },
    ]
  },
  // 5. Hạng C1 (Tải 3.500kg - 7.500kg)
  {
    name: "Ma trận chuẩn Hạng C1",
    licenseName: "C1",
    totalQuestions: 40,
    passingScore: 36,
    durationMinutes: 24,
    minCriticalQuestions: 1,
    isDefault: true,
    details: [
      { chapterCode: '1', percentage: 25 },
      { chapterCode: '2', percentage: 10 },
      { chapterCode: '3', percentage: 5 },
      { chapterCode: '4', percentage: 10 },
      { chapterCode: '5', percentage: 25 },
      { chapterCode: '6', percentage: 25 },
    ]
  },
  // 6. Hạng C (Tải trên 7.500kg)
  {
    name: "Ma trận chuẩn Hạng C (Mới)",
    licenseName: "C",
    totalQuestions: 40,
    passingScore: 36,
    durationMinutes: 24,
    minCriticalQuestions: 1,
    isDefault: true,
    details: [
      { chapterCode: '1', percentage: 25 },
      { chapterCode: '2', percentage: 10 },
      { chapterCode: '3', percentage: 5 },
      { chapterCode: '4', percentage: 10 },
      { chapterCode: '5', percentage: 25 },
      { chapterCode: '6', percentage: 25 },
    ]
  },
  // 7. Hạng D1 (Ô tô 8 - 16 chỗ)
  {
    name: "Ma trận chuẩn Hạng D1",
    licenseName: "D1",
    totalQuestions: 45,
    passingScore: 42,
    durationMinutes: 26,
    minCriticalQuestions: 1,
    isDefault: true,
    details: [
      { chapterCode: '1', percentage: 20 },
      { chapterCode: '2', percentage: 10 },
      { chapterCode: '3', percentage: 10 },
      { chapterCode: '4', percentage: 10 },
      { chapterCode: '5', percentage: 25 },
      { chapterCode: '6', percentage: 25 },
    ]
  },
  // 8. Hạng D2 (Ô tô buýt, 16 - 29 chỗ)
  {
    name: "Ma trận chuẩn Hạng D2",
    licenseName: "D2",
    totalQuestions: 45,
    passingScore: 42,
    durationMinutes: 26,
    minCriticalQuestions: 1,
    isDefault: true,
    details: [
      { chapterCode: '1', percentage: 20 },
      { chapterCode: '2', percentage: 10 },
      { chapterCode: '3', percentage: 10 },
      { chapterCode: '4', percentage: 10 },
      { chapterCode: '5', percentage: 25 },
      { chapterCode: '6', percentage: 25 },
    ]
  },
  // 9. Hạng D (Ô tô trên 29 chỗ, giường nằm)
  {
    name: "Ma trận chuẩn Hạng D (Mới)",
    licenseName: "D",
    totalQuestions: 45,
    passingScore: 42,
    durationMinutes: 26,
    minCriticalQuestions: 1,
    isDefault: true,
    details: [
      { chapterCode: '1', percentage: 20 },
      { chapterCode: '2', percentage: 10 },
      { chapterCode: '3', percentage: 10 },
      { chapterCode: '4', percentage: 10 },
      { chapterCode: '5', percentage: 25 },
      { chapterCode: '6', percentage: 25 },
    ]
  },
  // 10. Hạng BE (Hạng B kéo rơ moóc > 750kg)
  {
    name: "Ma trận chuẩn Hạng BE",
    licenseName: "BE",
    totalQuestions: 45,
    passingScore: 42,
    durationMinutes: 26,
    minCriticalQuestions: 1,
    isDefault: true,
    details: [
      { chapterCode: '1', percentage: 20 },
      { chapterCode: '3', percentage: 10 },
      { chapterCode: '4', percentage: 10 },
      { chapterCode: '5', percentage: 30 },
      { chapterCode: '6', percentage: 30 },
    ]
  },
  // 11. Hạng C1E (Hạng C1 kéo rơ moóc > 750kg)
  {
    name: "Ma trận chuẩn Hạng C1E",
    licenseName: "C1E",
    totalQuestions: 45,
    passingScore: 42,
    durationMinutes: 26,
    minCriticalQuestions: 1,
    isDefault: true,
    details: [
      { chapterCode: '1', percentage: 20 },
      { chapterCode: '3', percentage: 10 },
      { chapterCode: '4', percentage: 10 },
      { chapterCode: '5', percentage: 30 },
      { chapterCode: '6', percentage: 30 },
    ]
  },
  // 12. Hạng CE (Hạng C kéo rơ moóc, đầu kéo)
  {
    name: "Ma trận chuẩn Hạng CE",
    licenseName: "CE",
    totalQuestions: 45,
    passingScore: 42,
    durationMinutes: 26,
    minCriticalQuestions: 1,
    isDefault: true,
    details: [
      { chapterCode: '1', percentage: 20 },
      { chapterCode: '3', percentage: 10 },
      { chapterCode: '4', percentage: 10 },
      { chapterCode: '5', percentage: 30 },
      { chapterCode: '6', percentage: 30 },
    ]
  },
  // 13. Hạng D1E (Hạng D1 kéo rơ moóc > 750kg)
  {
    name: "Ma trận chuẩn Hạng D1E",
    licenseName: "D1E",
    totalQuestions: 45,
    passingScore: 42,
    durationMinutes: 26,
    minCriticalQuestions: 1,
    isDefault: true,
    details: [
      { chapterCode: '1', percentage: 20 },
      { chapterCode: '3', percentage: 10 },
      { chapterCode: '4', percentage: 10 },
      { chapterCode: '5', percentage: 30 },
      { chapterCode: '6', percentage: 30 },
    ]
  },
  // 14. Hạng D2E (Hạng D2 kéo rơ moóc > 750kg)
  {
    name: "Ma trận chuẩn Hạng D2E",
    licenseName: "D2E",
    totalQuestions: 45,
    passingScore: 42,
    durationMinutes: 26,
    minCriticalQuestions: 1,
    isDefault: true,
    details: [
      { chapterCode: '1', percentage: 20 },
      { chapterCode: '3', percentage: 10 },
      { chapterCode: '4', percentage: 10 },
      { chapterCode: '5', percentage: 30 },
      { chapterCode: '6', percentage: 30 },
    ]
  },
  // 15. Hạng DE (Hạng D kéo rơ moóc, khách nối toa)
  {
    name: "Ma trận chuẩn Hạng DE",
    licenseName: "DE",
    totalQuestions: 45,
    passingScore: 42,
    durationMinutes: 26,
    minCriticalQuestions: 1,
    isDefault: true,
    details: [
      { chapterCode: '1', percentage: 20 },
      { chapterCode: '3', percentage: 10 },
      { chapterCode: '4', percentage: 10 },
      { chapterCode: '5', percentage: 30 },
      { chapterCode: '6', percentage: 30 },
    ]
  }
];