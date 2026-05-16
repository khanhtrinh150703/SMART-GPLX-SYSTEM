import { useCallback, useMemo } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { FILTER_FIELDS } from "../components/filters/history-filter.config";
import { HistoryQueryParams } from "../types/history.types";

/**
 * Hook quản lý URL Params cho lịch sử thi (History URL Params Hook)
 * Đảm bảo đồng bộ giữa UI Search Bar và API Payload Mapping.
 */
export function useHistoryUrlParams() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // 1. Xác định trường đang tìm kiếm (Active Search Field)
  const activeField = useMemo(() => {
    return searchParams.get("field") || "title"; // Mặc định tìm theo tiêu đề
  }, [searchParams]);

  // 2. Lấy giá trị tìm kiếm hiện tại (Active Search Value)
  const activeValue = useMemo(() => {
    return searchParams.get("search") || "";
  }, [searchParams]);

  /**
   * Cập nhật nhiều tham số cùng lúc (Batch Update URL Params)
   */
  const updateMultipleUrlParams = useCallback(
    <T extends object>(params: T) => {
      const current = new URLSearchParams(searchParams.toString());

      Object.entries(params).forEach(([key, value]) => {
        if (value === null || value === undefined || value === "" || value === "all") {
          current.delete(key);
        } else {
          current.set(key, String(value));
        }
      });

      // Reset về trang 1 khi lọc (Reset to page 1 on filter)
      if (!('page' in params)) {
        current.set("page", "1");
      }
      
      router.push(`${pathname}?${current.toString()}`, { scroll: false });
    },
    [pathname, router, searchParams]
  );

  /**
   * Xử lý tìm kiếm động từ Search Bar (Dynamic Field Search Handling)
   * Map 'field' và 'search' trên URL để UI giữ trạng thái.
   */
  const handleSearchByField = useCallback(
    (field: string, value: string) => {
      const current = new URLSearchParams(searchParams.toString());

      // Xóa các trường cũ để tránh xung đột (Clean legacy fields)
      FILTER_FIELDS.forEach((f) => current.delete(f.value));
      current.delete("search");

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
    [pathname, router, searchParams]
  );

  /**
   * Ánh xạ URL sang HistoryQueryParams cho API (Mapping URL to API Payload)
   * Xử lý ép kiểu dữ liệu cho Score và Duration.
   */
  const getApiParams = (): HistoryQueryParams => {
    // Khởi tạo các tham số cơ bản (Base query initialization)
    const query: Record<string, string | number | boolean | undefined> = {
      page: Number(searchParams.get("page")) || 1,
      limit: 10,
      sortBy: searchParams.get("sortBy") || "createdAt",
      sortOrder: (searchParams.get("sortOrder") as "asc" | "desc") || "desc",
      
      // Bộ lọc thời gian (Date Range Filters)
      startDate: searchParams.get("startDate") || undefined,
      endDate: searchParams.get("endDate") || undefined,
    };

    // BƯỚC QUAN TRỌNG: Mapping động từ Search Bar (Dynamic Mapping from Search Bar)
    const f = searchParams.get("field");
    const s = searchParams.get("search");

    if (f && s) {
      if (f === "score" || f === "durationTime") {
        query[f] = Number(s); // Ép kiểu số (Number coercion)
      } else {
        query[f] = s; // Giữ kiểu chuỗi (String assignment)
      }
    }

    // Các trường lọc bổ sung không nằm trong Search Bar (Additional filters)
    const extraFilters = ["licenseCategoryName", "status"];
    extraFilters.forEach((key) => {
      const val = searchParams.get(key);
      if (val && val !== "all") {
        query[key] = val;
      }
    });

    return query as HistoryQueryParams;
  };

  const clearFilters = useCallback(() => {
    router.push(pathname, { scroll: false });
  }, [pathname, router]);

  return {
    searchParams,
    activeField,
    activeValue,
    updateMultipleUrlParams,
    handleSearchByField,
    clearFilters,
    getApiParams,
    FILTER_FIELDS,
  };
}