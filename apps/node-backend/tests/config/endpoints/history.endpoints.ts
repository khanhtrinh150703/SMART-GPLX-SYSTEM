export const HISTORY_ENDPOINTS = {
  SUMMARY_LIST: "/api/v1/exam-histories/summary",
  SUMMARY_DETAIL: (id: string) => `/api/v1/exam-histories/summary/${id}`,
  LIST: "/api/v1/exam-histories",
  DETAIL: (id: string) => `/api/v1/exam-histories/${id}`,
};