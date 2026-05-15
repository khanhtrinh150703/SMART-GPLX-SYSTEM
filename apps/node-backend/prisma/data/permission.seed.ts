import { PermissionSeed } from "./interface.seed";

export const permissions: PermissionSeed[] = [
  // ==========================================
  // HỆ THỐNG NGƯỜI DÙNG & PHÂN QUYỀN (IDENTITY)
  // ==========================================
  {
    name: "admin:all",
    description:
      "Toàn quyền quản trị tối cao, bypass tất cả các cơ chế gác cổng",
  },
  {
    name: "users:manage",
    description: "Quản trị viên quản lý danh sách, cập nhật và xóa người dùng",
  },
  {
    name: "roles:manage",
    description: "Quản lý danh sách vai trò (Roles) trong hệ thống",
  },

  // ==========================================
  // NGÂN HÀNG CÂU HỎI & IMPORT (QUESTIONS)
  // ==========================================
  {
    name: "questions:read",
    description: "Truy vấn danh sách và xem chi tiết câu hỏi",
  },
  {
    name: "questions:manage",
    description: "Thêm mới, cập nhật, xóa và khôi phục câu hỏi",
  },
  {
    name: "questions:import",
    description:
      "Khởi tạo, tải lên và hoàn tất tiến trình import câu hỏi từ file",
  },

  // ==========================================
  // HẠNG BẰNG & CHƯƠNG HỌC LÝ THUYẾT
  // ==========================================
  { name: "licenses:read", description: "Xem danh sách các hạng bằng lái xe" },
  {
    name: "licenses:manage",
    description: "Tạo mới, cập nhật, xóa và khôi phục thông tin hạng bằng",
  },
  {
    name: "chapters:read",
    description: "Xem danh sách và chi tiết các chương học lý thuyết",
  },
  {
    name: "chapters:manage",
    description: "Tạo mới, cập nhật, xóa và khôi phục chương học",
  },

  // ==========================================
  // MA TRẬN & CẤU TRÚC ĐỀ THI
  // ==========================================
  {
    name: "exam-matrices:read",
    description: "Lấy danh sách các ma trận cấu trúc đề thi",
  },
  {
    name: "exam-matrices:manage",
    description: "Quản lý, tạo mới, cập nhật, xóa và khôi phục ma trận",
  },
  { name: "exams:read", description: "Truy vấn danh sách bài thi hệ thống" },
  {
    name: "exams:manage",
    description: "Khởi tạo (tự động/thủ công), cập nhật, xóa bài thi",
  },

  // ==========================================
  // PHIÊN THI ĐANG DIỄN RA (ACTIVE SESSIONS)
  // ==========================================
  {
    name: "active-sessions:read",
    description: "Kiểm tra trạng thái phiên thi hiện tại của học viên",
  },
  {
    name: "active-sessions:write",
    description: "Bắt đầu phiên thi chính thức và đồng bộ đáp án (Sync)",
  },
  {
    name: "active-sessions:delete",
    description: "Hủy/Xóa phiên làm bài đang hoạt động",
  },

  // ==========================================
  // NỘP BÀI & LỊCH SỬ THI (ATTEMPTS & HISTORIES)
  // ==========================================
  {
    name: "exam-attempts:write",
    description: "Nộp bài thi, chấm điểm và lưu kết quả vào Snapshot",
  },
  {
    name: "exam-attempts:read",
    description: "Lấy danh sách lịch sử làm bài cá nhân (Từ NoSQL)",
  },
  {
    name: "exam-attempts:read-detail",
    description: "Xem chi tiết một bản ghi lịch sử thi cá nhân (Từ NoSQL)",
  },
  {
    name: "exam-histories:read",
    description: "Truy vấn danh sách tóm tắt lịch sử thi (Từ SQL)",
  },
  {
    name: "exam-histories:read-detail",
    description: "Truy vấn chi tiết tóm tắt của một bản ghi bài thi (Từ SQL)",
  },

  // ==========================================
  // THỐNG KÊ (STATISTICS)
  // ==========================================
  {
    name: "statistics:read",
    description: "Xem bảng tổng quan và chi tiết tiến độ học tập cá nhân",
  },
  {
    name: "statistics:sync",
    description: "Đồng bộ thủ công dữ liệu thống kê hệ thống",
  },
];
