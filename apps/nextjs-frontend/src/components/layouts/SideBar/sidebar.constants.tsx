import { NavItem } from "@/types/sidebar.types";
import {
  LayoutDashboard,
  History,
  UserCircle,
  Settings,
  Database,
  Users,
  CreditCard,
  BookOpen,
  FileUp,
  ClipboardList,
  Grid3X3,
  Pencil,
} from "lucide-react";

export const NAV_ITEMS: NavItem[] = [
  {
    href: "/overview",
    title: "Tổng quan",
    label: "Dashboard",
    icon: LayoutDashboard,
    // Trang tổng quan mặc định cho mọi user sau khi login, hoặc có thể dùng "statistics:read" nếu muốn gác cổng nâng cao
  },
  {
    href: "/take-exam",
    title: "Làm bài thi",
    label: "Take an Exam",
    icon: Pencil,
    requiredPermission: "exams:read", // Học viên cần quyền đọc danh sách đề thi hệ thống để chọn bài
  },
  {
    href: "/history",
    title: "Lịch sử thi",
    label: "Exam History",
    icon: History,
    requiredPermission: "exam-histories:read", // Khớp với quyền đọc tóm tắt lịch sử từ SQL
  },
  {
    href: "/profile",
    title: "Hồ sơ cá nhân",
    label: "Personal Profile",
    icon: UserCircle,
    // Bỏ trống quyền vì đây là tính năng mặc định cho mọi tài khoản đã xác thực
  },

  // --- PHÂN ĐOẠN QUẢN TRỊ (ADMIN/INSTRUCTOR) ---
  {
    href: "/admin/exams",
    title: "Quản lý đề thi",
    label: "Exam Management",
    icon: ClipboardList,
    requiredPermission: "exams:manage",
  },
  {
    href: "/admin/exam-matrices",
    title: "Quản lý ma trận đề thi",
    label: "Exam Matrix",
    icon: Grid3X3,
    requiredPermission: "exam-matrices:manage", // Đồng bộ số nhiều "matrices" chuẩn chỉ
  },
  {
    href: "/admin/user",
    title: "Quản lý người dùng",
    label: "Users Management",
    icon: Users,
    requiredPermission: "users:manage", // Nâng lên manage để thực hiện các thao tác quản trị user
  },
  {
    href: "/admin/chapter",
    title: "Quản lý chương học",
    label: "Chapter Management",
    icon: BookOpen,
    requiredPermission: "chapters:manage",
  },
  {
    href: "/admin/question",
    title: "Ngân hàng câu hỏi",
    label: "Question Bank",
    icon: Database,
    requiredPermission: "questions:manage", // Quyền quản trị thêm/sửa/xóa ngân hàng câu hỏi
  },
  {
    href: "/admin/license",
    title: "Hạng bằng lái",
    label: "License Types",
    icon: CreditCard,
    requiredPermission: "licenses:manage",
  },
  {
    href: "/admin/question/import",
    title: "Import câu hỏi",
    label: "Import Questions",
    icon: FileUp,
    requiredPermission: "questions:import", // Khớp chuẩn tên tiến trình import file câu hỏi
  },
  // {
  //   href: "/settings",
  //   title: "Cài đặt",
  //   label: "System Settings",
  //   icon: Settings,
  //   requiredPermission: "roles:manage", // Cài đặt hệ thống cốt lõi giao cho bên quản lý vai trò gác cổng
  // },
];
