import { LucideIcon } from "lucide-react";

/**
 * NavItem Interface (Giao diện mục điều hướng mới)
 */
export interface NavItem {
  title: string;           // Tiêu đề (Tiếng Việt)
  label: string;           // Nhãn phụ (Tiếng Anh)
  href: string;            // Đường dẫn
  icon: LucideIcon;        // Icon component
  
  // 🚀 THAY THẾ roles/minRole BẰNG CÁI NÀY
  requiredPermission?: string; 
  
  // Mẹo: Nếu ông muốn một mục cần NHIỀU quyền mới hiện, hãy dùng:
  // requiredPermissions?: string[]; 
}