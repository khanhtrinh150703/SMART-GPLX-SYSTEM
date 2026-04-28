import { API_BASE } from '../api-base.config';

export const EXAM_ENDPOINTS = {
  BASE: API_BASE.EXAM,
  CREATE: API_BASE.EXAM,
  GET_BY_ID: (id: string) => `${API_BASE.EXAM}/${id}`,
  UPDATE: (id: string) => `${API_BASE.EXAM}/${id}`,
  DELETE: (id: string) => `${API_BASE.EXAM}/${id}`,
  RESTORE: (id: string) => `${API_BASE.EXAM}/${id}/restore`,
} as const;