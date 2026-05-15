import { useCallback, useMemo } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { FILTER_FIELDS } from "../components/license.config";
import { LicenseQueryParams } from "../types/license";

export function useLicenseUrlParams() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const activeField = useMemo(() => {
    return searchParams.get("field") || "name";
  }, [searchParams]);

  // 2. Lấy giá trị tìm kiếm thực tế cho Backend (Backend Value)
  // Luôn luôn lấy từ key 'search' theo đúng yêu cầu của Backend
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

      if (key !== "page") current.set("page", "1");
      // scroll: false để tránh bị nhảy trang khi đang tương tác (Avoid jumpy UX)
      router.push(`${pathname}?${current.toString()}`, { scroll: false });
    },
    [pathname, router],
  );

  /**
   * @description Xử lý tìm kiếm: Đẩy 'search' cho BE và 'field' cho FE UI
   */
  const handleSearchByField = useCallback(
    (field: string, value: string) => {
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
    },
    [pathname, router],
  );

  /**
   * @description Map dữ liệu gửi lên API (Mapping to API Payload)
   */
  const getApiParams = (): LicenseQueryParams => {
    // 1. Chỉ khởi tạo những thứ chắc chắn là tham số chung.
    // Tuyệt đối KHÔNG khai báo 'search' hay 'field' ở đây.
    const query: Record<string, string | number | boolean | undefined> = {
      page: Number(searchParams.get("page")) || 1,
      limit: 10,
      status: searchParams.get("status") || "all",
      sortBy: searchParams.get("sortBy") || "name",
      sortOrder: (searchParams.get("sortOrder") as "asc" | "desc") || "asc",
    };

    // 2. Bốc "nguyên liệu" từ URL để xử lý riêng
    const f = searchParams.get("field"); // ví dụ: 'minAge'
    const s = searchParams.get("search"); // ví dụ: '15615'

    // 3. Logic Mapping: Đổ giá trị vào đúng túi và "phi tang" field/search
    if (f && s) {
      // Ép kiểu dựa trên tên trường f
      if (f === "minAge") {
        query[f] = Number(s); // Gán trực tiếp: query.minAge = 15615
      } else if (s === "true" || s === "false") {
        query[f] = s === "true";
      } else {
        query[f] = s; // Gán trực tiếp: query.description = '...'
      }
    }

    return query as LicenseQueryParams;
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
