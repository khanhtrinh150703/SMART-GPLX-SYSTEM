// 💡 Nhớ đổi tên file thành .tsx nhé!
import {
  LayoutDashboard,
  FileText,
  History,
  UserCircle,
  Settings,
  Database,
  Users,
  CreditCard,
  BookOpen,
} from "lucide-react";

export const NAV_ITEMS = [
  {
    href: "/",
    label: "Tổng quan",
    icon: <LayoutDashboard className="w-5 h-5" />,
  },
  {
    href: "/dashboard/exams",
    label: "Quản lý Đề thi",
    icon: <FileText className="w-5 h-5" />,
  },
  {
    href: "/dashboard/history",
    label: "Lịch sử thi",
    icon: <History className="w-5 h-5" />,
  },
  {
    href: "/profile",
    label: "Hồ sơ cá nhân",
    icon: <UserCircle className="w-5 h-5" />,
  },
  {
    href: "/admin/users",
    label: "Quản lý người dùng",
    icon: <Users className="w-5 h-5" />,
  },
  {
    href: "/chapter", // Cập nhật theo yêu cầu của cậu
    label: "Quản lý chương học",
    icon: <BookOpen className="w-5 h-5" />, // Chapter Management
  },
  {
    href: "/questions", // Cập nhật theo yêu cầu của cậu
    label: "Ngân hàng câu hỏi",
    icon: <Database className="w-5 h-5" />, // Question Bank
  },
  {
    href: "/licenses", // Cập nhật theo yêu cầu của cậu
    label: "Hạng bằng lái",
    icon: <CreditCard className="w-5 h-5" />, // License/GPLX Management
  },
  {
    href: "/settings",
    label: "Cài đặt",
    icon: <Settings className="w-5 h-5" />,
  },
];
