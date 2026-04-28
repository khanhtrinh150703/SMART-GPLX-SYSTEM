import { NavItem } from "@/types/sidebar.types";
import {
  LayoutDashboard, History, UserCircle,
  Settings, Database, Users, CreditCard, BookOpen, FileUp,
  ClipboardList, Grid3X3, Award, Pencil,
} from "lucide-react";

export const NAV_ITEMS: NavItem[] = [
  {
    href: "/overview",
    title: "Tổng quan",
    label: "Dashboard",
    icon: LayoutDashboard,
  },
  {
    href: "/take-exam",
    title: "Làm bài thi",
    label: "Take an Exam",
    icon: Pencil, // Icon cái bút cho việc làm bài (Icon for taking an exam)
    requiredPermission: "exams:take",
  },
  {
    href: "/history",
    title: "Lịch sử thi",
    label: "Exam History",
    icon: History,
    requiredPermission: "results:read",
  },
  {
    href: "/results",
    title: "Kết quả bài thi",
    label: "Exam Results",
    icon: Award, // Icon huy chương cho kết quả (Icon for exam results)
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
    href: "/admin/exams",
    title: "Quản lý đề thi",
    label: "Exam Management",
    icon: ClipboardList, // Icon danh sách kiểm tra (Icon for management)
    requiredPermission: "exams:manage", 
  },
  {
    href: "/admin/exam-matrices",
    title: "Quản lý ma trận đề thi",
    label: "Exam Matrix",
    icon: Grid3X3, // Icon lưới cho ma trận (Icon for matrix)
    requiredPermission: "exam-matrix:manage",
  },
  {
    href: "/admin/user",
    title: "Quản lý người dùng",
    label: "Users Management",
    icon: Users,
    requiredPermission: "users:read",
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
    requiredPermission: "questions:read",
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
    requiredPermission: "questions:import",
  },
  {
    href: "/settings",
    title: "Cài đặt",
    label: "System Settings",
    icon: Settings,
  },
];