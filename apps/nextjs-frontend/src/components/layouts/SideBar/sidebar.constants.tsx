// 💡 Nhớ đổi tên file thành .tsx nhé!
import { 
  LayoutDashboard, 
  FileText, 
  History, 
  UserCircle 
} from "lucide-react";

export const NAV_ITEMS = [
  {
    href: '/',
    label: 'Tổng quan',
    icon: <LayoutDashboard className="w-5 h-5" />,
  },
  {
    href: '/dashboard/exams',
    label: 'Quản lý Đề thi',
    icon: <FileText className="w-5 h-5" />,
  },
  {
    href: '/dashboard/history',
    label: 'Lịch sử thi',
    icon: <History className="w-5 h-5" />,
  },
  {
    href: '/profile',
    label: 'Hồ sơ cá nhân',
    icon: <UserCircle className="w-5 h-5" />,
  },
];