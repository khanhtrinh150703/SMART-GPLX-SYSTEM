import { API_BASE } from '../api-base.config';

export const QUESTION_ENDPOINTS = {
  BASE: API_BASE.QUESTION,
  BY_ID: (id: string) => `${API_BASE.QUESTION}/${id}`,
  RESTORE: (id: string) => `${API_BASE.QUESTION}/${id}/restore`,
} as const;
