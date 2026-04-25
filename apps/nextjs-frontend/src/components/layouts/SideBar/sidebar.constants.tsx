import { NavItem } from "@/types/sidebar.types";
import {
  LayoutDashboard, FileText, History, UserCircle,
  Settings, Database, Users, CreditCard, BookOpen, FileUp,
} from "lucide-react";

export const NAV_ITEMS: NavItem[] = [
  {
    href: "/dashboard",
    title: "Tổng quan",
    label: "Dashboard",
    icon: LayoutDashboard,
    // Không để requiredPermission = Mặc định ai cũng thấy (Public)
  },
  {
    href: "/dashboard/exams",
    title: "Quản lý Đề thi",
    label: "Exams Management",
    icon: FileText,
    requiredPermission: "exams:manage", 
  },
  {
    href: "/dashboard/history",
    title: "Lịch sử thi",
    label: "Exam History",
    icon: History,
    requiredPermission: "results:read",
  },
  {
    href: "/profile",
    title: "Hồ sơ cá nhân",
    label: "Personal Profile",
    icon: UserCircle,
    requiredPermission: "profile:manage",
  },
  
  // --- PHÂN ĐOẠN QUẢN TRỊ (ADMIN/INSTRUCTOR) ---
  {
    href: "/admin/users",
    title: "Quản lý người dùng",
    label: "Users Management",
    icon: Users,
    requiredPermission: "users:read",
  },
  {
    href: "/chapter",
    title: "Quản lý chương học",
    label: "Chapter Management",
    icon: BookOpen,
    requiredPermission: "chapters:manage",
  },
  {
    href: "/questions",
    title: "Ngân hàng câu hỏi",
    label: "Question Bank",
    icon: Database,
    requiredPermission: "questions:read",
  },
  {
    href: "/licenses",
    title: "Hạng bằng lái",
    label: "License Types",
    icon: CreditCard,
    requiredPermission: "licenses:manage",
  },
  {
    href: "/admin/questions/import",
    title: "Import câu hỏi",
    label: "Import Questions",
    icon: FileUp,
    requiredPermission: "questions:import",
  },
  {
    href: "/settings",
    title: "Cài đặt",
    label: "System Settings",
    icon: Settings,
    // Thường cài đặt hệ thống chỉ dành cho Admin tối thượng
    // requiredPermission: "admin:all", 
  },
];