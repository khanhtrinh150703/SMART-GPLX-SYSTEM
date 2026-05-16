// src/features/chapter/hooks/use-chapter-url-params.ts
import { useCallback, useMemo } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { FILTER_FIELDS } from "../components/chapter.config";
import { ChapterQueryParams } from "../types/chapter.query.";

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
  const updateUrlParam = useCallback(
    (key: string, value: string | number | null) => {
      const current = new URLSearchParams(window.location.search);

      if (!value || value === "all") {
        current.delete(key);
      } else {
        current.set(key, String(value));
      }

      if (key !== "page") current.set("page", "1");
      router.push(`${pathname}?${current.toString()}`, { scroll: false });
    },
    [pathname, router],
  );

  /**
   * @description Hàm xử lý tìm kiếm quan trọng nhất (Core Search Logic)
   * Vừa đẩy 'search' cho BE, vừa đẩy 'field' cho FE để không bị nhảy dropdown
   */
  const handleSearchByField = useCallback(
    (field: string, value: string) => {
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
    },
    [pathname, router],
  );

  /**
   * @description Trích xuất dữ liệu chuẩn để gửi lên API (Extract API Params)
   * Tuân thủ logic Mapping: Chuyển đổi 'field' và 'search' từ URL thành các key cụ thể.
   */
  // src/features/chapter/hooks/use-chapter-url-params.ts

  /**
   * @description Trích xuất dữ liệu chuẩn để gửi lên API (Extract API Params)
   * Sử dụng trực tiếp searchParams từ scope của Hook.
   */
  const getApiParams = (): ChapterQueryParams => {
    // 1. Chỉ khởi tạo những thứ chắc chắn là tham số chung.
    const query: Record<string, string | number | boolean | undefined> = {
      page: Number(searchParams.get("page")) || 1,
      limit: 10,
      status: searchParams.get("status") || "all",
      sortBy: searchParams.get("sortBy") || "name",
      sortOrder: (searchParams.get("sortOrder") as "asc" | "desc") || "asc",
    };

    // 2. Bốc "nguyên liệu" (Ingredients) từ URL để xử lý riêng
    const f = searchParams.get("field");
    const s = searchParams.get("search");

    // 3. Logic Mapping: Đổ giá trị vào đúng túi và "phi tang" field/search
    if (f && s) {
      if (f === "orderIndex") {
        // Chuyển đổi sang số (Number conversion)
        query[f] = Number(s);
      } else if (s === "true" || s === "false") {
        // Chuyển đổi sang Logic (Boolean conversion)
        query[f] = s === "true";
      } else {
        // Gán trực tiếp (Direct assignment): name, description...
        query[f] = s;
      }
    }

    return query as ChapterQueryParams;
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
    [pathname, router],
  );

  const clearFilters = useCallback(() => {
    router.push(pathname, { scroll: false });
  }, [pathname, router]);

  return {
    searchParams,
    activeField,
    activeValue,
    clearFilters,
    updateUrlParam,
    updateMultipleUrlParams,
    handleSearchByField,
    getApiParams,
    FILTER_FIELDS,
  };
}
