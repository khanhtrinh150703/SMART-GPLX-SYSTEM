import { StatusOption } from "@/types/types";

// 1. Định nghĩa kiểu dữ liệu License (Interface)
// Dịch: Cấu trúc dữ liệu của một Hạng bằng lái
export interface License {
  id: string | number;
  code: string; // Mã hạng bằng (A1, B2, C...)
  name: string; // Tên đầy đủ
  description: string; // Mô tả quyền hạn của bằng
  minAge: number; // Độ tuổi tối thiểu được phép thi
  totalQuestions: number; // Tổng số câu trong 1 đề thi
  passingScore: number; // Số câu đúng tối thiểu để ĐẠT
  testDuration: number; // Thời gian thi (phút)
  status: "active" | "draft" | "deleted";
}

// 2. Cấu hình Tab trạng thái
export const LICENSE_STATUS_OPTIONS: StatusOption<License["status"] | "all">[] =
  [
    {
      id: "all",
      label: "Tất cả",
    },
    {
      id: "active",
      label: "Đang hoạt động",
      color: "bg-emerald-500 shadow-lg shadow-emerald-200/50",
    },
    {
      id: "deleted",
      label: "Thùng rác",
      color: "bg-rose-500 shadow-lg shadow-rose-200/50",
    },
  ];

export const FILTER_FIELDS = [
  { label: "Tên hạng", value: "name" },
  { label: "Mô tả", value: "description" },
  { label: "Trạng thái", value: "status" },
  { label: "Độ tuổi", value: "minAge" },
];

/** * 3. Dữ liệu mẫu (Mock Data)
 * Cập nhật theo quy định thực tế của Tổng cục Đường bộ Việt Nam
 */
export const MOCK_LICENSES: License[] = [
  {
    id: "1",
    code: "A1",
    name: "Hạng A1",
    description:
      "Xe mô tô 2 bánh có dung tích xi lanh từ 50cm3 đến dưới 175cm3.",
    minAge: 18,
    totalQuestions: 25,
    passingScore: 21,
    testDuration: 19,
    status: "active",
  },
  {
    id: "2",
    code: "A2",
    name: "Hạng A2",
    description: "Xe mô tô 2 bánh có dung tích xi lanh từ 175cm3 trở lên.",
    minAge: 18,
    totalQuestions: 25,
    passingScore: 23,
    testDuration: 19,
    status: "active",
  },
  {
    id: "3",
    code: "B1",
    name: "Hạng B1 (Số tự động)",
    description:
      "Ô tô chở người đến 9 chỗ ngồi; ô tô tải chuyên dùng số tự động.",
    minAge: 18,
    totalQuestions: 30,
    passingScore: 27,
    testDuration: 20,
    status: "active",
  },
  {
    id: "4",
    code: "B2",
    name: "Hạng B2",
    description:
      "Xe ô tô chở người đến 9 chỗ; xe tải dưới 3.500kg. Được phép kinh doanh vận tải.",
    minAge: 18,
    totalQuestions: 35,
    passingScore: 32,
    testDuration: 22,
    status: "active",
  },
  {
    id: "5",
    code: "C",
    name: "Hạng C",
    description:
      "Xe ô tô tải, kể cả ô tô tải chuyên dùng có trọng tải từ 3.500kg trở lên.",
    minAge: 21,
    totalQuestions: 40,
    passingScore: 36,
    testDuration: 24,
    status: "active",
  },
  {
    id: "6",
    code: "D",
    name: "Hạng D",
    description: "Ô tô chở người từ 10 đến 30 chỗ ngồi.",
    minAge: 24,
    totalQuestions: 45,
    passingScore: 41,
    testDuration: 26,
    status: "active",
  },
  {
    id: "7",
    code: "E",
    name: "Hạng E",
    description: "Ô tô chở người trên 30 chỗ ngồi.",
    minAge: 27,
    totalQuestions: 45,
    passingScore: 41,
    testDuration: 26,
    status: "active",
  },
  {
    id: "8",
    code: "F",
    name: "Hạng F",
    description: "Các loại xe kéo rơ moóc tương ứng với hạng bằng chính.",
    minAge: 27,
    totalQuestions: 45,
    passingScore: 41,
    testDuration: 28,
    status: "draft",
  },
  {
    id: "9",
    code: "A3",
    name: "Hạng A3",
    description: "Xe mô tô 3 bánh, xe xích lô máy và các loại xe hạng A1.",
    minAge: 18,
    totalQuestions: 25,
    passingScore: 21,
    testDuration: 19,
    status: "active",
  },
  {
    id: "10",
    code: "A4",
    name: "Hạng A4",
    description: "Các loại máy kéo nhỏ có trọng tải đến 1.000kg.",
    minAge: 18,
    totalQuestions: 25,
    passingScore: 21,
    testDuration: 19,
    status: "deleted",
  },
];
