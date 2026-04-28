import { useCallback, useMemo } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { QueryParams } from "@/types/paginaton.type";
import { FILTER_FIELDS } from "../components/question.config";

export function useQuestionUrlParams() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // 1. Xác định field đang active trên Search Bar (Dịch: UI State Sync)
  // Ưu tiên lấy từ key 'field' trên URL để Dropdown không bị nhảy
  const activeField = useMemo(() => {
    return searchParams.get("field") || "content";
  }, [searchParams]);

  // 2. CHUẨN HÓA: Giá trị của field đang search luôn lấy từ biến 'search'
  // (Dịch: Standardized: Search value always maps to 'search' query param)
  const activeValue = useMemo(() => {
    return searchParams.get("search") || "";
  }, [searchParams]);

  /**
   * Cập nhật nhiều bộ lọc cùng lúc (Dịch: Batch Update Params)
   * Giữ lại các giá trị cũ, chỉ thay đổi những gì truyền vào
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

      if (!('page' in params)) {
        current.set("page", "1");
      }
      
      router.push(`${pathname}?${current.toString()}`, { scroll: false });
    },
    [pathname, router, searchParams]
  );

  /**
   * Xử lý tìm kiếm từ Search Bar (Dịch: Smart Keyword Search)
   * Quan trọng: Gán từ khóa vào biến 'search', gán loại bộ lọc vào biến 'field'
   */
  const handleSearchByField = useCallback(
    (field: string, value: string) => {
      const current = new URLSearchParams(searchParams.toString());

      // BƯỚC 1: Dọn dẹp rác từ phiên bản cũ (nếu có) để URL sạch sẽ
      // (Dịch: Clean up legacy dynamic fields to keep URL clean and prevent conflicts)
      FILTER_FIELDS.forEach((f) => current.delete(f.value));
      current.delete("search");

      // BƯỚC 2: Set giá trị mới chuẩn xác
      if (value.trim()) {
        current.set("search", value.trim()); // Backend cần biến này để lọc (Backend payload)
        current.set("field", field);         // UI cần biến này để giữ Dropdown (UI state)
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
   * Chuyển đổi URL sang QueryParams cho API (Dịch: API Payload Mapping)
   */
  const getApiParams = (): QueryParams => {
    // Ép kiểu chặt chẽ thay vì dùng 'any' (Strict typing instead of 'any')
    const query: Record<string, string | number | boolean | undefined> = {
      page: Number(searchParams.get("page")) || 1,
      limit: 10,
      sortBy: searchParams.get("sortBy") || "createdAt",
      sortOrder: (searchParams.get("sortOrder") as "asc" | "desc") || "desc",
      status: searchParams.get("status") || "all",

      // BƯỚC 3: Ném đúng biến 'search' cho Backend
      // (Dịch: Pass the exact 'search' variable to Backend DTO)
      search: searchParams.get("search") || undefined,
    };

    // Các key filter nâng cao (Đã loại bỏ 'content' và các text field ra khỏi đây)
    // (Dịch: Advanced filter keys - Removed text search fields to avoid duplication)
    const filterKeys = ["chapterId", "licenseCategoryIds", "difficultyLevel", "isCritical", "indexNumber"];

    filterKeys.forEach((key) => {
      const val = searchParams.get(key);
      if (val !== null && val !== "" && val !== "all") {
        if (key === "difficultyLevel") query[key] = Number(val);
        else if (key === "isCritical") query[key] = val === "true";
        else if (key === "indexNumber") query[key] = val === "true";
        else query[key] = val;
      }
    });

    return query as QueryParams;
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