// src/features/user-management/hooks/use-user-url-params.ts
import { useCallback, useMemo } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { FILTER_FIELDS } from "../components/users.config";
import { UserQueryParams } from "../types/user.query";

export function useUserUrlParams() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // 1. Duy trì trạng thái giao diện (UI State Persistence):
  // Nhìn vào key 'field' trên URL để biết dropdown đang chọn gì.
  const activeField = useMemo(() => {
    return searchParams.get("field") || "name";
  }, [searchParams]);

  // 2. Lấy giá trị tìm kiếm (Search Value):
  // Luôn lấy từ key 'search' vì Backend đã quy định như vậy.
  const activeValue = useMemo(() => {
    return searchParams.get("search") || "";
  }, [searchParams]);

  /**
   * @description Cập nhật một tham số đơn lẻ (Single Param Update)
   */
  const updateUrlParam = useCallback(
    (key: string, value: string | number | null) => {
      const current = new URLSearchParams(window.location.search);

      if (!value || value === "all") {
        current.delete(key);
      } else {
        current.set(key, String(value));
      }

      // Luôn quay về trang 1 khi lọc (Always reset to page 1 on filter)
      if (key !== "page") current.set("page", "1");

      // scroll: false giúp trang không bị nhảy lên đầu khi đang gõ (Prevent jumpy UX)
      router.push(`${pathname}?${current.toString()}`, { scroll: false });
    },
    [pathname, router],
  );

  /**
   * @description Xử lý tìm kiếm theo trường (Handle Search by Field)
   * Vừa đẩy 'search' cho Backend, vừa đẩy 'field' cho Frontend.
   */
  const handleSearchByField = useCallback(
    (field: string, value: string) => {
      const current = new URLSearchParams(window.location.search);

      // Dọn dẹp các bộ lọc cũ (Clean up old filters)
      FILTER_FIELDS.forEach((f) => current.delete(f.value));

      if (value.trim()) {
        // Key này để Backend gọi API (For Backend API)
        current.set("search", value.trim());
        // Key này để UI không bị nhảy về 'name' (For UI Consistency)
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
   * @description Map dữ liệu từ URL về định dạng API (Backend Mapping)
   */
  const getApiParams = (): UserQueryParams => {
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

    return query as UserQueryParams;
  };
  
  /**
   * @description Cập nhật nhiều tham số cùng lúc (Batch Update Params)
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

  return {
    searchParams,
    activeField,
    activeValue,
    updateUrlParam,
    updateMultipleUrlParams,
    handleSearchByField,
    getApiParams,
    FILTER_FIELDS,
  };
}
