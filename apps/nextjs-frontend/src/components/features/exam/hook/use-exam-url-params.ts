import { useCallback, useMemo } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { ExamQueryParams } from "../types/exam.query";

/**
 * Hook quản lý tham số URL cho danh sách Đề thi (Exam Management URL Params).
 * Dịch: Hỗ trợ đồng bộ hóa trạng thái lọc, tìm kiếm và phân trang lên thanh địa chỉ.
 */
export function useExamUrlParams() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // 1. Xác định trường đang tìm kiếm (Active Search Field) - Mặc định là 'name'
  const activeField = useMemo(
    () => searchParams.get("field") || "name",
    [searchParams],
  );

  // 2. Giá trị từ khóa tìm kiếm hiện tại (Current Search Value)
  const activeValue = useMemo(
    () => searchParams.get("search") || "",
    [searchParams],
  );

  /**
   * Cập nhật một tham số đơn lẻ (Update single param).
   * Dịch: Thay đổi một giá trị lọc và đẩy lên URL.
   */
  const updateUrlParam = useCallback(
    (key: string, value: string | number | null) => {
      const current = new URLSearchParams(window.location.search);

      if (
        value === null ||
        value === undefined ||
        value === "all" ||
        value === ""
      ) {
        current.delete(key);
      } else {
        current.set(key, String(value));
      }

      // Reset về trang 1 khi thay đổi bộ lọc (Reset to page 1 on filter change)
      if (key !== "page") current.set("page", "1");

      router.push(`${pathname}?${current.toString()}`, { scroll: false });
    },
    [pathname, router],
  );

  /**
   * Logic Tìm kiếm theo trường (Search by Field Logic).
   * Dịch: Xử lý tìm kiếm và lưu lại trường dữ liệu (field) để không bị reset dropdown.
   */
  const handleSearchByField = useCallback(
    (field: string, value: string) => {
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
    },
    [pathname, router],
  );

  /**
   * Trích xuất params để gọi API (Extract API Params).
   * Dịch: Chuyển đổi tham số URL thành Object sạch để truyền vào Service.
   */
  const getApiParams = (): ExamQueryParams => {
    // 1. Khởi tạo tham số mặc định (Paging & Sorting)
    const query: Record<string, string | number | boolean | undefined> = {
      page: Number(searchParams.get("page")) || 1,
      limit: 10,
      status: searchParams.get("status") || "all",
      sortBy: searchParams.get("sortBy") || "createdAt", // Mặc định sort theo ngày tạo
      sortOrder: (searchParams.get("sortOrder") as "asc" | "desc") || "desc",
    };

    // 2. Bốc "nguyên liệu" động từ URL
    const f = searchParams.get("field"); // Ví dụ: 'totalQuestions'
    const s = searchParams.get("search"); // Ví dụ: '25'

    // 3. Logic Mapping: Chuyển đổi 'field/search' sang 'key/value' thực tế
    if (f && s) {
      switch (f) {
        case "totalQuestions":
        case "minCriticalQuestions":
        case "passingScore":
        case "durationMinutes":
          query[f] = Number(s); // Ép kiểu số cho tổng số câu
          break;

        case "licenseCategoryName":
        case "name":
        case "status":
        case "startedAt":
        case "fullName":
          query[f] = s; // Giữ nguyên kiểu chuỗi
          break;

        default:
          // Xử lý các trường boolean nếu phát sinh (ví dụ: isPassed)
          if (s === "true" || s === "false") {
            query[f] = s === "true";
          } else {
            query[f] = s;
          }
          break;
      }
    }

    return query as ExamQueryParams;
  };

  /**
   * Cập nhật nhiều tham số cùng lúc (Bulk update params).
   * Dịch: Sử dụng cho các hành động phức tạp hoặc nút RESET.
   */
  const updateMultipleUrlParams = useCallback(
    (params: Record<string, string | number | null>) => {
      const current = new URLSearchParams(window.location.search);

      Object.entries(params).forEach(([key, value]) => {
        // Xử lý đặc biệt cho Search (Special handling for search)
        if (key === "search") {
          if (!value) {
            current.delete("search");
            current.delete("field");
            return;
          }
        }

        if (
          value === null ||
          value === undefined ||
          value === "all" ||
          value === ""
        ) {
          current.delete(key);
        } else {
          current.set(key, String(value));
        }
      });

      current.set("page", "1");
      router.push(`${pathname}?${current.toString()}`, { scroll: false });
    },
    [pathname, router],
  );

  /**
   * Xóa toàn bộ bộ lọc (Clear All Filters).
   */
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
