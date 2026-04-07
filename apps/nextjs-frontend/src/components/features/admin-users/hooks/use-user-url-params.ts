import { useCallback } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { QueryParams } from "@/types/paginaton.type";
import { FILTER_FIELDS } from "../components/users.config";

export function useUserUrlParams() {
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
    const current = new URLSearchParams(window.location.search);
    FILTER_FIELDS.forEach((f) => current.delete(f.value));

    if (value.trim()) current.set(field, value.trim());
    current.set("page", "1");
    router.push(`${pathname}?${current.toString()}`);
  }, [pathname, router]);

  const getApiParams = (): QueryParams => {
    const rawSortOrder = searchParams.get("sortOrder");
    const sortOrder: "asc" | "desc" = (rawSortOrder === "asc" || rawSortOrder === "desc") ? rawSortOrder : "desc";

    // 1. Các thông số cơ bản
    const query: QueryParams = {
      page: Number(searchParams.get("page")) || 1,
      limit: 10,
      status: searchParams.get("status") || "all",
      sortBy: searchParams.get("sortBy") || "name", // Mặc định sort theo name (BE)
      sortOrder,
    };

    // 2. Duyệt qua FILTER_FIELDS để bốc dữ liệu từ URL
    FILTER_FIELDS.forEach((f) => {
      const val = searchParams.get(f.value);

      if (val !== null && val !== "") {
        // 🚨 CÚ LỪA Ở ĐÂY: Nếu field là 'title', mình đổi key thành 'name' cho Backend
        const apiKey = f.value === "title" ? "name" : f.value;

        // Xử lý kiểu dữ liệu (số hoặc chữ)
        query[apiKey] = (f.value === "orderIndex")
          ? Number(val)
          : val;
      }
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