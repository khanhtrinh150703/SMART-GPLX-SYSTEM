import { UserRoleEnum } from "@/constants/enum/use.enum";
import { UserRole } from "@/types/user.type";

// ✅ Dùng Record để đảm bảo mọi Enum đều phải có trọng số
export const ROLE_WEIGHT: Record<UserRoleEnum, number> = {
  [UserRoleEnum.ADMIN]: 30,
  [UserRoleEnum.INSTRUCTOR]: 20,
  [UserRoleEnum.STUDENT]: 10,
};

/**
 * Kiểm tra quyền hạn dựa trên danh sách Roles của User
 */
export const hasPermission = (
  userRoles: UserRole[] | undefined, 
  minRole?: UserRoleEnum
): boolean => {
  // 1. Nếu trang không yêu cầu quyền, cho qua luôn
  if (!minRole) return true;
  
  // 2. Nếu không có role nào hoặc mảng rỗng, chặn ngay
  if (!userRoles || userRoles.length === 0) return false;

  // 3. Trích xuất trọng số của từng Role mà User sở hữu
  const weights = userRoles.map((r) => ROLE_WEIGHT[r.name] || 0);

  // 4. Lấy trọng số cao nhất (Quyền to nhất)
  const maxWeight = Math.max(...weights);

  // 5. So sánh với trọng số tối thiểu yêu cầu
  return maxWeight >= ROLE_WEIGHT[minRole];
};