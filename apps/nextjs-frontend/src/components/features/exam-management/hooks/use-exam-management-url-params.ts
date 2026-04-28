// src/features/exam-management/hooks/use-exam-management-url-params.ts
import { useCallback, useMemo } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

/**
 * Hook quản lý tham số URL cho Ma trận đề thi.
 * Hỗ trợ đồng bộ hóa giữa Giao diện (Dropdown/Search) và Backend (API).
 */
export function useExamManagementUrlParams() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // 1. Xác định field đang chọn để tìm kiếm (Mặc định là 'name')
  const activeField = useMemo(() => searchParams.get("field") || "name", [searchParams]);

  // 2. Giá trị từ khóa tìm kiếm hiện tại
  const activeValue = useMemo(() => searchParams.get("search") || "", [searchParams]);

  /**
   * Cập nhật một tham số đơn lẻ (Update single param)
   */
  const updateUrlParam = useCallback((key: string, value: string | number | null) => {
    const current = new URLSearchParams(window.location.search);

    if (value === null || value === undefined || value === "all" || value === "") {
      current.delete(key);
    } else {
      current.set(key, String(value));
    }

    // Reset về trang 1 khi thay đổi bất kỳ bộ lọc nào (trừ khi đang chuyển trang)
    if (key !== "page") current.set("page", "1");

    router.push(`${pathname}?${current.toString()}`, { scroll: false });
  }, [pathname, router]);

  /**
   * Logic Tìm kiếm: Vừa đẩy giá trị 'search', vừa giữ lại 'field' để Dropdown không bị reset.
   */
  const handleSearchByField = useCallback((field: string, value: string) => {
    const current = new URLSearchParams(window.location.search);

    if (value.trim()) {
      current.set("search", value.trim());
      current.set("field", field);
    } else {
      current.delete("search");
      current.delete("field");
    }

    current.set("page", "1");
    router.push(`${pathname}?${current.toString()}`, { scroll: false });
  }, [pathname, router]);

  /**
   * Trích xuất toàn bộ params để gọi API (Extract API Params)
   * Đồng bộ hoàn toàn với ExamMatrixQueryDTO.
   */
  const getApiParams = useCallback(() => {
    return {
      page: Number(searchParams.get("page")) || 1,
      limit: Number(searchParams.get("limit")) || 10,
      status: searchParams.get("status") || "all",

      // Tìm kiếm
      search: searchParams.get("search") || undefined,
      activeField: searchParams.get("field") || "name",

      // Các bộ lọc chỉ số kỹ thuật (Numeric filters)
      totalQuestions: searchParams.get("totalQuestions") || undefined,
      passingScore: searchParams.get("passingScore") || undefined,
      durationMinutes: searchParams.get("durationMinutes") || undefined,

      // Lọc theo hạng bằng
      licenseCategory: searchParams.get("licenseCategory") || undefined,

      // Sắp xếp
      sortBy: searchParams.get("sortBy") || "createdAt",
      sortOrder: (searchParams.get("sortOrder") as "asc" | "desc") || "desc",
    };
  }, [searchParams]);

  /**
   * Cập nhật nhiều tham số cùng lúc (Bulk update params)
   * Thường dùng cho nút RESET hoặc bộ lọc phức tạp.
   */
  const updateMultipleUrlParams = useCallback(
    (params: Record<string, string | number | null>) => {
      const current = new URLSearchParams(window.location.search);

      Object.entries(params).forEach(([key, value]) => {
        // Đặc biệt: Nếu xóa search thì xóa luôn cả field
        if (key === "q" || key === "search") {
          if (!value) {
            current.delete("search");
            current.delete("field");
            return;
          }
        }

        if (value === null || value === undefined || value === "all" || value === "") {
          current.delete(key);
        } else {
          current.set(key, String(value));
        }
      });

      current.set("page", "1");
      router.push(`${pathname}?${current.toString()}`, { scroll: false });
    },
    [pathname, router]
  );

  const clearFilters = useCallback(() => {
    router.push(pathname, { scroll: false });
  }, [pathname, router]);

  return {
    searchParams,
    activeField,
    activeValue,
    updateUrlParam,
    updateMultipleUrlParams,
    handleSearchByField,
    clearFilters,
    getApiParams,
  };
}