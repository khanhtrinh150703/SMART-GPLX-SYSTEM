import { useQuery } from "@tanstack/react-query";
import { masterService } from "@/services/master-data/master-data.service";
import { useUserStore } from "@/store/user/user.store";

/**
 * 1. useLicenseOptions: Lấy danh sách hạng bằng lái cho Select Option
 * (Yêu cầu quyền xem danh mục bằng lái hoặc Admin tối cao)
 */
export const useLicenseOptions = () => {
  const permissions = useUserStore((state) => state.permissions);

  // Kiểm tra quyền đọc hạng bằng lái hoặc cấu hình hệ thống
  const canViewLicenses =
    permissions.includes("licenses:read") ||
    permissions.includes("licenses:manage") ||
    permissions.includes("admin:all");

  return useQuery({
    queryKey: ["master", "licenses"],
    queryFn: () => masterService.getLicenseCategorySelection(),
    enabled: canViewLicenses,
    staleTime: 1000 * 60 * 60, // 1 tiếng vì master data ít thay đổi
  });
};

/**
 * 2. useChapterOptions: Lấy danh sách chương học cho Select Option
 */
export const useChapterOptions = () => {
  const permissions = useUserStore((state) => state.permissions);

  // Kiểm tra quyền đọc chương học lý thuyết
  const canViewChapters =
    permissions.includes("chapters:read") ||
    permissions.includes("chapters:manage") ||
    permissions.includes("admin:all");

  return useQuery({
    queryKey: ["master", "chapters"],
    queryFn: () => masterService.getChapterSelection(),
    enabled: canViewChapters,
    staleTime: 1000 * 60 * 30, // 30 phút
  });
};

/**
 * 3. useRoleOptions: Lấy danh sách Vai trò hệ thống để gán phân quyền
 * (Tính năng bảo mật cao, thường chỉ dành cho cấu hình phân quyền Admin)
 */
export const useRoleOptions = () => {
  const permissions = useUserStore((state) => state.permissions);

  // Chỉ những người có quyền quản lý vai trò hoặc Admin tối cao mới được load dữ liệu này
  const canViewRoles =
    permissions.includes("roles:manage") || permissions.includes("admin:all");

  return useQuery({
    queryKey: ["master", "roles"],
    queryFn: () => masterService.getRoleSelection(),
    enabled: canViewRoles,
    staleTime: 1000 * 60 * 60 * 24, // 24 tiếng
  });
};

/**
 * 4. useExamMatrixOptions: Lấy danh sách ma trận đề thi để phục vụ sinh đề/làm bài
 */
export const useExamMatrixOptions = () => {
  const permissions = useUserStore((state) => state.permissions);

  // Cần quyền đọc ma trận cấu trúc hoặc tạo đề thi
  const canViewMatrices =
    permissions.includes("exam-matrices:read") ||
    permissions.includes("exam-matrices:manage") ||
    permissions.includes("exams:manage") || // Giảng viên tạo đề thủ công cũng cần đọc ma trận
    permissions.includes("admin:all");

  return useQuery({
    queryKey: ["master", "exam-matrices"],
    queryFn: () => masterService.getExamMatrixSelection(),
    enabled: canViewMatrices,
    staleTime: 1000 * 60 * 10, // 10 phút
  });
};
