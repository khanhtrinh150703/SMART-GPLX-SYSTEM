export const STATISTICS_ENDPOINTS = {
  ME: "/api/v1/statistics/me",
  TOPICS: "/api/v1/statistics/me/topics",
  TOPIC_DETAIL: (topicId: string) => `/api/v1/statistics/me/topics/${topicId}`,
  SYNC: "/api/v1/statistics/sync",
};
