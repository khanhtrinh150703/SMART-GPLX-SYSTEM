import { UserRoleEnum } from "@/constants/enum/use.enum";
import { useUserStore } from "@/store/user/user.store";

export const useAuthRole = () => {
  const user = useUserStore((state) => state.user);
  
  // Ép kiểu roles về mảng Enum chuẩn
  const roles = (user?.roles.map(r => r.name) as UserRoleEnum[]) || [];
  
  return {
    isAdmin: roles.includes(UserRoleEnum.ADMIN),
    isInstructor: roles.includes(UserRoleEnum.INSTRUCTOR),
    isStudent: roles.includes(UserRoleEnum.STUDENT),
    userRoles: roles,
    displayName: user?.roles[0]?.displayName || "Guest"
  };
};