import { UserRoleEnum } from "@/constants/enum/use.enum";
import { LucideIcon } from "lucide-react";

/**
 * NavItem Interface (Giao diện mục điều hướng)
 * T: Generic cho phép mở rộng nếu cần
 */
export interface NavItem {
  title: string;          // Tiêu đề chính (Vietnamese)
  label: string;          // Nhãn phụ (English)
  href: string;           // Đường dẫn điều hướng
  icon: LucideIcon;       // Component biểu tượng (Reference, không phải Instance)
  roles?: UserRoleEnum[];       // Danh sách quyền được phép truy cập (RBAC)
}