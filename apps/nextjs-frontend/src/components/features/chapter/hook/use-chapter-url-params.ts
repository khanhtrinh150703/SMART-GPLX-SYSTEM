import { useCallback } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { QueryParams } from "@/types/paginaton.type";
import { FILTER_FIELDS } from "../components/chapter.config";

export function useChapterUrlParams() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const activeField = FILTER_FIELDS.find((f) => searchParams.has(f.value))?.value || "name";
  const activeValue = searchParams.get(activeField) || "";

  const updateUrlParam = useCallback((key: string, value: string | number | null) => {
    const current = new URLSearchParams(window.location.search);
    if (!value || value === "all") current.delete(key);
    else current.set(key, String(value));

    if (key !== "page") current.set("page", "1");
    router.push(`${pathname}?${current.toString()}`);
  }, [pathname, router]);

  const handleSearchByField = useCallback((field: string, value: string) => {
    // 1. Khởi tạo params từ URL hiện tại
    const current = new URLSearchParams(window.location.search);

    // 2. LOG ĐỂ KIỂM TRA (Trinh mở Console xem 2 thằng này có đúng ko)
    // 3. Thay vì delete hết FILTER_FIELDS, mình chỉ xử lý đúng cái field đang search
    if (value.trim()) {
      current.set(field, value.trim());
    } else {
      current.delete(field);
    }

    // 4. Reset về trang 1
    current.set("page", "1");

    // 5. Đẩy lên Router
    const search = current.toString();
    const query = search ? `?${search}` : "";

    router.push(`${pathname}${query}`);
  }, [pathname, router]);

  const getApiParams = (): QueryParams => {
    const rawSortOrder = searchParams.get("sortOrder");
    const sortOrder: "asc" | "desc" = (rawSortOrder === "asc" || rawSortOrder === "desc") ? rawSortOrder : "desc";

    const query: QueryParams = {
      page: Number(searchParams.get("page")) || 1,
      limit: 10,
      status: searchParams.get("status") || "all",
      sortBy: searchParams.get("sortBy") || "name",
      sortOrder,
    };

    FILTER_FIELDS.forEach((f) => {
      const val = searchParams.get(f.value);
      if (val !== null) query[f.value] = f.value === "minAge" ? Number(val) : val;
    });

    return query;
  };

  const updateMultipleUrlParams = useCallback(
    (params: Record<string, string | number | null>) => {
      const current = new URLSearchParams(window.location.search);

      Object.entries(params).forEach(([key, value]) => {
        if (!value || value === "all") current.delete(key);
        else current.set(key, String(value));

        if (key !== "page") current.set("page", "1"); // Có filter/sort thì auto về trang 1
      });

      router.push(`${pathname}?${current.toString()}`);
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