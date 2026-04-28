import { useCallback, useMemo } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { QueryParams } from "@/types/paginaton.type";
import { FILTER_FIELDS } from "../components/license.config";

export function useLicenseUrlParams() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // 1. Xác định field đang active trên UI (UI State Detection)
  // Ưu tiên lấy từ key 'field' trên URL để giữ trạng thái Dropdown
  const activeField = useMemo(() => {
    return searchParams.get("field") || "name";
  }, [searchParams]);

  // 2. Lấy giá trị tìm kiếm thực tế (Backend Search Value)
  // Luôn lấy từ key 'search' vì Backend License yêu cầu như vậy
  const activeValue = useMemo(() => {
    return searchParams.get("search") || "";
  }, [searchParams]);

  /**
   * @description Cập nhật một tham số đơn lẻ (Single Param Update)
   */
  const updateUrlParam = useCallback((key: string, value: string | number | null) => {
    const current = new URLSearchParams(window.location.search);
    
    if (!value || value === "all") {
      current.delete(key);
    } else {
      current.set(key, String(value));
    }

    if (key !== "page") current.set("page", "1");
    // scroll: false để tránh bị nhảy trang khi đang tương tác (Avoid jumpy UX)
    router.push(`${pathname}?${current.toString()}`, { scroll: false });
  }, [pathname, router]);

  /**
   * @description Xử lý tìm kiếm: Đẩy 'search' cho BE và 'field' cho FE UI
   */
  const handleSearchByField = useCallback((field: string, value: string) => {
    const current = new URLSearchParams(window.location.search);
    
    // Xóa dấu vết cũ (Clear old filters)
    FILTER_FIELDS.forEach((f) => current.delete(f.value));
    
    if (value.trim()) {
      // Key 'search' dành cho Backend gọi API
      current.set("search", value.trim());
      // Key 'field' dành cho Frontend giữ trạng thái Dropdown
      current.set("field", field);
    } else {
      current.delete("search");
      current.delete("field");
    }

    current.set("page", "1");
    router.push(`${pathname}?${current.toString()}`, { scroll: false });
  }, [pathname, router]);

  /**
   * @description Map dữ liệu gửi lên API (Mapping to API Payload)
   */
  const getApiParams = (): QueryParams => {
    const query: QueryParams = {
      page: Number(searchParams.get("page")) || 1,
      limit: 10,
      status: searchParams.get("status") || "all",
      sortBy: searchParams.get("sortBy") || "name",
      sortOrder: (searchParams.get("sortOrder") as "asc" | "desc") || "asc",
    };

    // Chỉ lấy duy nhất key 'search' gửi cho Backend
    const searchValue = searchParams.get("search");
    if (searchValue) {
      query["search"] = searchValue;
    }

    return query;
  };

  /**
   * @description Cập nhật nhiều tham số cùng lúc (Batch Update)
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