// data.seed.ts

// --- Interfaces ---

interface UserSeed {
  username: string;
  email: string;
  password: string;
  fullName: string;
  phoneNumber: string;
  roleNames: string[];
}

export interface PermissionSeed {
  name: string;
  description: string;
}

export interface RoleSeed {
  name: string;
  description: string;
  permissions: string[]; // Danh sách tên permission
}

export interface LicenseSeed {
  name: string;
  description: string;
  minAge: number;
  orderIndex: number;
}

export interface ChapterSeed {
  code: string;
  name: string;
  description: string;
  orderIndex: number;
}

export interface MatrixDetailSeed {
  chapterCode: string; // Dùng code để tìm ID
  percentage: number;
}

export interface MatrixSeed {
  name: string;
  licenseName: string; // Dùng name để tìm ID (A1, B2...)
  totalQuestions: number;
  passingScore: number;
  durationMinutes: number;
  minCriticalQuestions: number;
  isDefault: boolean;
  details: MatrixDetailSeed[];
}

// --- Data ---
export const permissions: PermissionSeed[] = [
  { name: 'users:read', description: 'Xem danh sách người dùng' },
  { name: 'users:manage', description: 'Thêm, sửa, khóa tài khoản người dùng' },
  { name: 'profile:manage', description: 'Cập nhật thông tin cá nhân của chính mình' },
  { name: 'questions:read', description: 'Xem ngân hàng câu hỏi' },
  { name: 'questions:write', description: 'Thêm/Sửa câu hỏi và đáp án' },
  { name: 'questions:import', description: 'Import câu hỏi từ file Excel' },
  { name: 'questions:delete', description: 'Xóa câu hỏi' },
  { name: 'chapters:read', description: 'Xem nội dung bài học' },
  { name: 'chapters:manage', description: 'Quản lý chương học và mẹo thi' },
  { name: 'licenses:read', description: 'Xem danh sách các hạng bằng lái' },
  { name: 'licenses:manage', description: 'Quản lý thông tin các hạng bằng' },
  { name: 'exams:manage', description: 'Tạo và cấu trúc bộ đề thi' },
  { name: 'exams:read', description: 'Xem danh sách các cấu trúc bộ đề thi' },
  { name: 'exams:take', description: 'Thực hiện bài thi thử' },
  { name: 'results:read', description: 'Xem lịch sử và kết quả thi' },
  { name: 'matrices:read', description: 'Xem cấu trúc ma trận đề thi' },
  { name: 'matrices:manage', description: 'Quản lý ma trận đề thi' },
  { name: 'admin:all', description: 'Toàn quyền hệ thống' },
];

export const roles: RoleSeed[] = [
  {
    name: 'ADMIN',
    description: 'Quản trị viên hệ thống',
    permissions: ['admin:all']
  },
  {
    name: 'INSTRUCTOR',
    description: 'Giảng viên/Người ra đề',
    permissions: ['questions:read', 'questions:write', 'chapters:read', 'matrices:read']
  },
  {
    name: 'STUDENT',
    description: 'Học viên/Thí sinh',
    permissions: ['chapters:read', 'exams:take', 'results:read', 'profile:manage']
  },
];

export const users: UserSeed[] = [
  {
    username: 'admin',
    email: 'admin@smartgplx.com',
    password: 'AdminPassword123@',
    fullName: 'Quản trị viên hệ thống',
    phoneNumber: '0999999999',
    roleNames: ['ADMIN'],
  },
  {
    username: 'instructor_test',
    email: 'instructor@smartgplx.com',
    password: 'InstructorPassword123@',
    fullName: 'Giảng viên hướng dẫn',
    phoneNumber: '0977777777',
    roleNames: ['INSTRUCTOR'],
  },
  {
    username: 'student_test',
    email: 'testuser@smartgplx.com',
    password: 'UserPassword123@',
    fullName: 'Học viên dùng thử',
    phoneNumber: '0988888888',
    roleNames: ['STUDENT'],
  },
  {
    username: 'testusertemp',
    email: 'temp@smartgplx.com',
    password: 'TempPassword123@',
    fullName: 'Học viên dự phòng (Multi-role)',
    phoneNumber: '0966666666',
    roleNames: ['STUDENT', 'INSTRUCTOR'], // User này có 2 quyền
  },
];

/**
 * @description Danh sách dữ liệu mẫu cho các hạng bằng lái xe tại Việt Nam.
 * Được sắp xếp theo thứ tự phân hạng từ mô tô đến ô tô tải/khách.
 */
export const licenses: LicenseSeed[] = [
  {
    name: 'A1',
    description: 'Mô tô 2 bánh có dung tích xi-lanh đến 125 cm3 hoặc công suất động cơ điện đến 11 kW.',
    minAge: 18,
    orderIndex: 1
  },
  {
    name: 'A',
    description: 'Mô tô 2 bánh có dung tích xi-lanh trên 125 cm3 hoặc công suất điện trên 11 kW; các loại xe hạng A1.',
    minAge: 18,
    orderIndex: 2
  },
  {
    name: 'B1',
    description: 'Mô tô 3 bánh; các loại xe quy định cho giấy phép lái xe hạng A1.',
    minAge: 18,
    orderIndex: 3
  },
  {
    name: 'B',
    description: 'Ô tô chở người đến 08 chỗ; xe ô tô tải và ô tô chuyên dùng có khối lượng đến 3.500 kg; kéo rơ moóc đến 750 kg.',
    minAge: 18,
    orderIndex: 4
  },
  {
    name: 'C1',
    description: 'Ô tô tải và chuyên dùng có khối lượng từ 3.500 kg đến 7.500 kg; kéo rơ moóc đến 750 kg; các loại xe hạng B.',
    minAge: 19,
    orderIndex: 5
  },
  {
    name: 'C',
    description: 'Ô tô tải và chuyên dùng có khối lượng trên 7.500 kg; kéo rơ moóc đến 750 kg; các loại xe hạng B và C1.',
    minAge: 21,
    orderIndex: 6
  },
  {
    name: 'D1',
    description: 'Ô tô chở người từ trên 08 chỗ đến 16 chỗ; kéo rơ moóc đến 750 kg; các loại xe hạng B, C1, C.',
    minAge: 24,
    orderIndex: 7
  },
  {
    name: 'D2',
    description: 'Ô tô chở người (kể cả xe buýt) từ trên 16 chỗ đến 29 chỗ; kéo rơ moóc đến 750 kg; các loại xe hạng B, C1, C, D1.',
    minAge: 24,
    orderIndex: 8
  },
  {
    name: 'D',
    description: 'Ô tô chở người trên 29 chỗ; xe giường nằm; kéo rơ moóc đến 750 kg; các loại xe hạng B, C1, C, D1, D2.',
    minAge: 27,
    orderIndex: 9
  },
  {
    name: 'BE',
    description: 'Các loại xe hạng B kéo rơ moóc có khối lượng trên 750 kg.',
    minAge: 18,
    orderIndex: 10
  },
  {
    name: 'C1E',
    description: 'Các loại xe hạng C1 kéo rơ moóc có khối lượng trên 750 kg.',
    minAge: 19,
    orderIndex: 11
  },
  {
    name: 'CE',
    description: 'Các loại xe hạng C kéo rơ moóc trên 750 kg; xe ô tô đầu kéo kéo sơ mi rơ moóc.',
    minAge: 24,
    orderIndex: 12
  },
  {
    name: 'D1E',
    description: 'Các loại xe hạng D1 kéo rơ moóc có khối lượng trên 750 kg.',
    minAge: 24,
    orderIndex: 13
  },
  {
    name: 'D2E',
    description: 'Các loại xe hạng D2 kéo rơ moóc có khối lượng trên 750 kg.',
    minAge: 24,
    orderIndex: 14
  },
  {
    name: 'DE',
    description: 'Các loại xe hạng D kéo rơ moóc trên 750 kg; xe ô tô chở khách nối toa.',
    minAge: 27,
    orderIndex: 15
  },
  {
    name: 'I',
    description: 'Mô tả chi tiết cho hạng bằng lái I.',
    minAge: 18,
    orderIndex: 16
  },
  {
    name: 'II',
    description: 'Mô tả chi tiết cho hạng bằng lái II.',
    minAge: 18,
    orderIndex: 17
  },
  {
    name: 'III',
    description: 'Mô tả chi tiết cho hạng bằng lái III.',
    minAge: 18,
    orderIndex: 18
  },
  {
    name: 'IV',
    description: 'Mô tả chi tiết cho hạng bằng lái IV.',
    minAge: 18,
    orderIndex: 19
  },
  {
    name: 'V',
    description: 'Mô tả chi tiết cho hạng bằng lái V.',
    minAge: 18,
    orderIndex: 20
  },
  {
    name: 'VI',
    description: 'Mô tả chi tiết cho hạng bằng lái VI.',
    minAge: 18,
    orderIndex: 21
  }
];

export const chapters: ChapterSeed[] = [
  {
    code: '1',
    name: 'Chương I: Quy định chung và quy tắc giao thông đường bộ',
    description: 'Gồm 180 câu (từ câu số 1 đến câu 180) về quy định chung và các quy tắc giao thông đường bộ.',
    orderIndex: 1
  },
  {
    code: '2',
    name: 'Chương II: Văn hóa giao thông, đạo đức người lái xe, kỹ năng PCCC và cứu hộ, cứu nạn',
    description: 'Gồm 25 câu (từ câu 181 đến câu 205) về văn hóa giao thông, đạo đức và kỹ năng phòng cháy, cứu hộ.',
    orderIndex: 2
  },
  {
    code: '3',
    name: 'Chương III: Kỹ thuật lái xe',
    description: 'Gồm 58 câu (từ câu 206 đến câu 263) hướng dẫn các phương pháp và kỹ năng điều khiển xe an toàn.',
    orderIndex: 3
  },
  {
    code: '4',
    name: 'Chương IV: Cấu tạo và sửa chữa',
    description: 'Gồm 37 câu (từ câu 264 đến câu 300) về cấu tạo cơ bản và cách khắc phục sự cố thông thường của xe ô tô.',
    orderIndex: 4
  },
  {
    code: '5',
    name: 'Chương V: Báo hiệu đường bộ',
    description: 'Gồm 185 câu (từ câu 301 đến câu 485) về hệ thống biển báo hiệu, vạch kẻ đường.',
    orderIndex: 5
  },
  {
    code: '6',
    name: 'Chương VI: Giải thế sa hình và kỹ năng xử lý tình huống giao thông',
    description: 'Gồm 115 câu (từ câu 486 đến câu 600) về quy tắc ưu tiên và xử lý tình huống tại các thế sa hình.',
    orderIndex: 6
  },
  {
    code: '7',
    name: 'Chương Test',
    description: 'Gồm 115 câu (từ câu 486 đến câu 600) về quy tắc ưu tiên và xử lý tình huống tại các thế sa hình.',
    orderIndex: 7
  },
];

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