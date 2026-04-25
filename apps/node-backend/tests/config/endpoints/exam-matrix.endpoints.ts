import { API_BASE } from '../api-base.config';

export const EXAM_MATRIX_ENDPOINTS = {
  BASE: API_BASE.EXAM_MATRIX,
  CREATE: API_BASE.EXAM_MATRIX,
  GET_BY_ID: (id: string) => `${API_BASE.EXAM_MATRIX}/${id}`,
  UPDATE: (id: string) => `${API_BASE.EXAM_MATRIX}/${id}`,
  DELETE: (id: string) => `${API_BASE.EXAM_MATRIX}/${id}`,
  RESTORE: (id: string) => `${API_BASE.EXAM_MATRIX}/${id}/restore`,
} as const;