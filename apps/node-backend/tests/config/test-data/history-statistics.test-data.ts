
export const HISTORY_STATISTICS_PAYLOAD = {
  QUERIES: {
    VALID_FILTERS: () => ({
      page: "2",
      limit: "5",
      search: "Đề thi mẫu",
      licenseCategoryId: "ce",
      score: "35",
      fromDate: "2026-01-01",
    }),
    INVALID_FORMAT_GARBAGE: () => ({
      page: "chuoi_rac",    // DTO tự fallback về 1
      limit: "chuoi_rac",   // DTO tự fallback về 10
      score: "chuoi_rac",   // DTO tự lọc biến thành undefined
      fromDate: "ngay_sai", // DTO tự lọc biến thành undefined
    }),
    EMPTY: () => ({}),
  },
};