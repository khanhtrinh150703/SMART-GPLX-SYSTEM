// src/features/chapter/hooks/use-chapter-url-params.ts
import { useCallback, useMemo } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { QueryParams } from "@/types/paginaton.type";
import { FILTER_FIELDS } from "../components/chapter.config";

export function useChapterUrlParams() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // 1. Xác định field đang chọn để hiển thị trên UI (UI Persistence)
  // Lấy từ key 'field' trên URL, nếu không có thì mặc định là 'name'
  const activeField = useMemo(() => {
    return searchParams.get("field") || "name";
  }, [searchParams]);

  // 2. Lấy giá trị tìm kiếm thực tế cho Backend (Backend Value)
  // Luôn luôn lấy từ key 'search' theo đúng yêu cầu của Backend
  const activeValue = useMemo(() => {
    return searchParams.get("search") || "";
  }, [searchParams]);

  /**
   * @description Cập nhật một tham số đơn lẻ nhưng vẫn giữ nguyên các tham số khác
   * (Update single param and preserve others)
   */
  const updateUrlParam = useCallback((key: string, value: string | number | null) => {
    const current = new URLSearchParams(window.location.search);
    
    if (!value || value === "all") {
      current.delete(key);
    } else {
      current.set(key, String(value));
    }

    if (key !== "page") current.set("page", "1");
    router.push(`${pathname}?${current.toString()}`, { scroll: false });
  }, [pathname, router]);

  /**
   * @description Hàm xử lý tìm kiếm quan trọng nhất (Core Search Logic)
   * Vừa đẩy 'search' cho BE, vừa đẩy 'field' cho FE để không bị nhảy dropdown
   */
  const handleSearchByField = useCallback((field: string, value: string) => {
    const current = new URLSearchParams(window.location.search);
    
    if (value.trim()) {
      // 1. Key này để Backend lọc dữ liệu (For Backend API)
      current.set("search", value.trim());
      // 2. Key này để Frontend giữ trạng thái dropdown (For UI State)
      current.set("field", field);
    } else {
      current.delete("search");
      current.delete("field");
    }

    current.set("page", "1");
    router.push(`${pathname}?${current.toString()}`, { scroll: false });
  }, [pathname, router]);

  /**
   * @description Trích xuất dữ liệu chuẩn để gửi lên API (Extract API Params)
   */
  const getApiParams = (): QueryParams => {
    const query: QueryParams = {
      page: Number(searchParams.get("page")) || 1,
      limit: 10,
      status: searchParams.get("status") || "all",
      sortBy: searchParams.get("sortBy") || "name",
      sortOrder: (searchParams.get("sortOrder") as "asc" | "desc") || "asc",
    };

    // Chỉ lấy key 'search' gửi lên BE
    const searchValue = searchParams.get("search");
    if (searchValue) {
      query["search"] = searchValue;
    }

    return query;
  };

  /**
   * @description Cập nhật nhiều tham số cùng lúc (Bulk update params)
   */
  const updateMultipleUrlParams = useCallback(
    (params: Record<string, string | number | null>) => {
      const current = new URLSearchParams(window.location.search);
      Object.entries(params).forEach(([key, value]) => {
        if (!value || value === "all") current.delete(key);
        else current.set(key, String(value));
      });
      current.set("page", "1");
      router.push(`${pathname}?${current.toString()}`, { scroll: false });
    },
    [pathname, router]
  );

  return {
    searchParams,
    activeField,
    activeValue,
    updateUrlParam,
    updateMultipleUrlParams,
    handleSearchByField,
    getApiParams,
    FILTER_FIELDS
  };
}