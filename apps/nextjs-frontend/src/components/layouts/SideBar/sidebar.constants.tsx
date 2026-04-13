import { UserRoleEnum } from "@/constants/enum/use.enum";
import { NavItem } from "@/types/sidebar.types";
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

/**
 * NAV_ITEMS Configuration (Cấu hình danh mục điều hướng)
 * Sử dụng cho Sidebar và Mobile Menu
 */
export const NAV_ITEMS: NavItem[] = [
  {
    href: "/dashboard",
    title: "Tổng quan",
    label: "Dashboard",
    icon: LayoutDashboard,
  },
  {
    href: "/dashboard/exams",
    title: "Quản lý Đề thi",
    label: "Exams Management",
    icon: FileText,
    roles: [UserRoleEnum.ADMIN, UserRoleEnum.INSTRUCTOR],
  },
  {
    href: "/dashboard/history",
    title: "Lịch sử thi",
    label: "Exam History",
    icon: History,
  },
  {
    href: "/profile",
    title: "Hồ sơ cá nhân",
    label: "Personal Profile",
    icon: UserCircle,
  },
  // --- PHÂN ĐOẠN QUẢN TRỊ (ADMIN SECTION) ---
  {
    href: "/admin/users",
    title: "Quản lý người dùng",
    label: "Users Management",
    icon: Users,
    roles: [UserRoleEnum.ADMIN],
  },
  {
    href: "/chapter",
    title: "Quản lý chương học",
    label: "Chapter Management",
    icon: BookOpen,
    roles: [UserRoleEnum.ADMIN, UserRoleEnum.INSTRUCTOR],
  },
  {
    href: "/questions",
    title: "Ngân hàng câu hỏi",
    label: "Question Bank",
    icon: Database,
    roles: [UserRoleEnum.ADMIN, UserRoleEnum.INSTRUCTOR],
  },
  {
    href: "/licenses",
    title: "Hạng bằng lái",
    label: "License Types",
    icon: CreditCard,
    roles: [UserRoleEnum.ADMIN, UserRoleEnum.INSTRUCTOR],
  },
  // ------------------------------------------
  {
    href: "/settings",
    title: "Cài đặt",
    label: "System Settings",
    icon: Settings,
  },
];
