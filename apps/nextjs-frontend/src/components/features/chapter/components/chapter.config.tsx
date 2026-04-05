// file: chapter-config.tsx

import { StatusOption } from "@/types/types";

// 1. Định nghĩa kiểu dữ liệu Chapter (Interface)
// Dịch: Cấu trúc dữ liệu của một Chương học
export interface Chapter {
  id: string | number;
  order: number;
  title: string; // Thống nhất dùng 'title'
  description: string;
  status: "active" | "draft" | "deleted"; // Các trạng thái thực tế trong DB
  lessonCount: number;
}

// 2. Cấu hình Tab (Status Tabs Configuration)
// Dịch: Cấu hình các Tab trạng thái (Phải khớp với status của Chapter)
export const CHAPTER_STATUS_OPTIONS: StatusOption<Chapter["status"] | "all">[] =
  [
    { id: "all", label: "Tất cả" },
    { id: "active", label: "Hoạt động", color: "text-emerald-600" },
    { id: "draft", label: "Bản nháp", color: "text-slate-500" },
    { id: "deleted", label: "Thùng rác", color: "text-rose-600" },
  ];

/** * 3. Dữ liệu mẫu (Mock Data)
 * Đã sửa: Đổi 'name' thành 'title' để khớp với Interface Chapter
 */
export const MOCK_CHAPTERS: Chapter[] = [
  {
    id: "1",
    order: 1,
    title: "Khái niệm và quy tắc giao thông",
    description:
      "Các định nghĩa cơ bản, hệ thống biển báo, quy tắc ưu tiên và luật giao thông.",
    status: "active",
    lessonCount: 166,
  },
  {
    id: "2",
    order: 2,
    title: "Nghiệp vụ vận tải",
    description:
      "Quy định về vận chuyển hàng hóa, hành khách và trách nhiệm của đơn vị vận tải.",
    status: "active",
    lessonCount: 26,
  },
  {
    id: "3",
    order: 3,
    title: "Văn hóa và đạo đức lái xe",
    description:
      "Trách nhiệm của lái xe, phòng tránh bia rượu và đạo đức nghề nghiệp.",
    status: "active",
    lessonCount: 21,
  },
  {
    id: "4",
    order: 4,
    title: "Kỹ thuật lái xe ô tô",
    description:
      "Các thao tác cơ bản và nâng cao khi điều khiển xe trong nhiều điều kiện.",
    status: "active",
    lessonCount: 56,
  },
  {
    id: "5",
    order: 5,
    title: "Cấu tạo và sửa chữa thông thường",
    description:
      "Kiến thức về máy móc, hệ thống phanh, lái và cách khắc phục sự cố nhỏ.",
    status: "active",
    lessonCount: 35,
  },
  {
    id: "6",
    order: 6,
    title: "Hệ thống biển báo cấm",
    description:
      "Chi tiết về các loại biển báo cấm và mức độ xử phạt khi vi phạm.",
    status: "active",
    lessonCount: 40,
  },
  {
    id: "7",
    order: 7,
    title: "Biển báo nguy hiểm và cảnh báo",
    description:
      "Nhận biết các nguy cơ trên đường thông qua hệ thống biển báo vàng.",
    status: "active",
    lessonCount: 30,
  },
  {
    id: "8",
    order: 8,
    title: "Biển báo chỉ dẫn và hiệu lệnh",
    description:
      "Hướng dẫn lộ trình và các hiệu lệnh bắt buộc người tham gia giao thông tuân theo.",
    status: "active",
    lessonCount: 35,
  },
  {
    id: "9",
    order: 9,
    title: "Giải các thế sa hình cơ bản",
    description: "Quy tắc nhường đường tại các ngã tư, ngã ba và vòng xuyến.",
    status: "active",
    lessonCount: 60,
  },
  {
    id: "10",
    order: 10,
    title: "Sa hình nâng cao và tình huống khẩn cấp",
    description:
      "Cách xử lý các tình huống phức tạp có xe ưu tiên và đường tàu.",
    status: "draft",
    lessonCount: 54,
  },
  {
    id: "11",
    order: 11,
    title: "Câu hỏi điểm liệt (60 câu)",
    description:
      "Các tình huống mất an toàn giao thông nghiêm trọng bắt buộc phải thuộc.",
    status: "active",
    lessonCount: 60,
  },
  {
    id: "12",
    order: 12,
    title: "Kỹ năng lái xe trên đường cao tốc",
    description:
      "Quy tắc nhập làn, tách làn và giữ khoảng cách an toàn trên cao tốc.",
    status: "active",
    lessonCount: 20,
  },
  {
    id: "13",
    order: 13,
    title: "Lái xe trong điều kiện thời tiết xấu",
    description:
      "Kỹ năng xử lý khi trời mưa lớn, sương mù dày đặc hoặc đường trơn trượt.",
    status: "draft",
    lessonCount: 15,
  },
  {
    id: "14",
    order: 14,
    title: "Quy định về nồng độ cồn và chất kích thích",
    description:
      "Nghị định 100/123 về mức phạt và tác hại của rượu bia khi lái xe.",
    status: "active",
    lessonCount: 10,
  },
  {
    id: "15",
    order: 15,
    title: "Hướng dẫn phần mềm mô phỏng 120 tình huống",
    description:
      "Cách xác định thời điểm nhấn Space để đạt điểm tối đa trong kỳ thi.",
    status: "active",
    lessonCount: 120,
  },
  {
    id: "16",
    order: 16,
    title: "Kiến thức về bảo hiểm xe cơ giới",
    description: "Các loại bảo hiểm bắt buộc và tự nguyện cho chủ xe ô tô.",
    status: "deleted",
    lessonCount: 8,
  },
  {
    id: "17",
    order: 17,
    title: "Mẹo ghi nhớ nhanh lý thuyết",
    description: "Các phương pháp học nhanh bằng thơ hoặc từ khóa (keyword).",
    status: "active",
    lessonCount: 25,
  },
  {
    id: "18",
    order: 18,
    title: "Hồ sơ và quy trình sát hạch",
    description:
      "Các bước chuẩn bị giấy tờ và quy trình thực hiện bài thi sát hạch.",
    status: "draft",
    lessonCount: 5,
  },
  {
    id: "19",
    order: 19,
    title: "Sơ cứu cơ bản khi xảy ra tai nạn",
    description:
      "Các bước xử lý tình huống khẩn cấp bảo vệ tính mạng nạn nhân.",
    status: "deleted",
    lessonCount: 12,
  },
  {
    id: "20",
    order: 20,
    title: "Tổng ôn và thi thử hạng B1, B2",
    description:
      "Tập hợp các bộ đề thi thử sát với đề thi thực tế của Bộ GTVT.",
    status: "active",
    lessonCount: 15,
  },
];
